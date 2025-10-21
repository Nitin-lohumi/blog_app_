import { router, publicProcuder } from "../trpc";
import { z } from "zod";
import { db } from "@/app/db";
import { posts } from "@/app/db/schema/PostSchema";
import { categories } from "@/app/db/schema/CategoriesSchema";
import { post_categories } from "@/app/db/schema/Post_Categories";
import { and, eq, sql, desc, notExists } from "drizzle-orm";
import { supabaseAdmin } from "@/utils/serverClient/supabaseServer";

const PostValidate = z.object({
  title: z.string().min(1, "Title required"),
  content: z.string().min(1, "Content required"),
  postPhoto: z.string().optional(),
  slug: z.string().min(1, "Slug required"),
  published: z.boolean().default(false),
  author: z.string().min(1, "Author required"),
  authorId: z.string().min(1, "Author ID required"),
  categories: z.array(z.string()).optional(),
  description: z.string().optional(),
});

const PostUpdateValidate = z.object({
  id: z.number(),
  title: z.string().optional(),
  content: z.string().optional(),
  slug: z.string().optional(),
  published: z.boolean().optional(),
  author: z.string().optional(),
  authorId: z.string().optional(),
  categories: z.array(z.string()).optional(),
  description: z.string().optional(),
});

type PostInputType = z.infer<typeof PostValidate>;
type PostUpdateType = z.infer<typeof PostUpdateValidate>;

export const postRouter = router({
  hello: publicProcuder.query(() => {
    return "this is a logic of trpc";
  }),

  fileHandler: publicProcuder
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.enum(["image/jpeg", "image/jpg", "image/png"]),
        fileBase64: z.string(),
        author: z.string(),
        authorId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const base64 = input.fileBase64.split(",")[1];
      const fileBuffer = Buffer.from(base64, "base64");
      const { data, error } = await supabaseAdmin.storage
        .from("post_photo")
        .upload(input.fileName, fileBuffer, {
          cacheControl: "3600",
          upsert: true,
        });
      if (error) throw new Error(error.message);

      const publicUrl = supabaseAdmin.storage
        .from("post_photo")
        .getPublicUrl(input.fileName).data.publicUrl;
      return publicUrl;
    }),
  getTop3POst: publicProcuder.query(async () => {
    const topPost = await db.query.posts.findMany({
      orderBy: desc(posts.createdAt),
      limit: 3,
    });
    return topPost;
  }),
  getPostById: publicProcuder
    .input(z.object({ postId: z.number() }))
    .query(async ({ input }) => {
      const { postId } = input;
      const post = await db.query.posts.findFirst({
        where: (p, { eq, and }) => eq(p.id, postId),
      });
      return post ? post : null;
    }),

  getAllpost: publicProcuder
    .input(z.object({ page: z.number(), filter: z.string().optional() }))
    .query(async ({ input }) => {
      const { page, filter } = input;
      const limit = 6;
      const offset = (page - 1) * limit;

      if (filter && filter.trim() !== "") {
        const category = await db.query.categories.findFirst({
          where: (c, { eq }) => eq(c.name, filter),
        });
        if (!category) {
          return {
            totalPage: 0,
            data: [],
            page,
            message: `No posts found for category "${filter}"`,
          };
        }
        const totalPost = await db
          .select({ count: sql<number>`count(*)` })
          .from(posts)
          .innerJoin(post_categories, eq(posts.id, post_categories.postId))
          .where(
            and(
              eq(posts.published, true),
              eq(post_categories.categoryId, category.id)
            )
          );
        const postByPage = await db
          .select()
          .from(posts)
          .innerJoin(post_categories, eq(posts.id, post_categories.postId))
          .where(
            and(
              eq(posts.published, true),
              eq(post_categories.categoryId, category.id)
            )
          )
          .orderBy(desc(posts.createdAt))
          .limit(limit)
          .offset(offset);
        return {
          totalPage: Math.ceil(totalPost[0].count / limit),
          data: postByPage,
          page,
          category: filter,
        };
      }
      const totalPost = await db
        .select({ count: sql<number>`count(*)` })
        .from(posts)
        .where(eq(posts.published, true));

      const postByPage = await db.query.posts.findMany({
        where: (post, { eq }) => eq(post.published, true),
        orderBy: (p, { desc }) => desc(p.createdAt),
        limit,
        offset,
      });

      return {
        totalPage: Math.ceil(totalPost[0].count / limit),
        data: postByPage,
        page,
      };
    }),

  getDraftPost: publicProcuder
    .input(z.object({ userId: z.string().nonempty() }))
    .query(async ({ input }) => {
      const { userId } = input;
      const posts = await db.query.posts.findMany({
        where: (post, { eq, and }) =>
          and(eq(post.authorId, userId), eq(post.published, false)),
        orderBy: (post, { desc }) => [desc(post.updatedAt)],
      });
      return posts;
    }),

  createPost: publicProcuder
    .input(PostValidate)
    .mutation(async ({ input }: { input: PostInputType }) => {
      const { categories: catgory, description, ...restPost } = input;
      const newPost = await db.insert(posts).values(restPost).returning();
      if (catgory?.length) {
        const categoryIds = await Promise.all(
          catgory.map(async (name) => {
            const existing = await db.query.categories.findFirst({
              where: (c, { eq }) => eq(c.name, name),
            });
            if (existing) return existing.id;
            const newCat = await db
              .insert(categories)
              .values({
                name,
                slug: name.toLowerCase(),
                description: input.description ?? "unknown",
              })
              .returning();
            return newCat[0].id;
          })
        );
        const postCategoryValues = categoryIds.map((catId) => ({
          postId: newPost[0].id,
          categoryId: catId,
        }));
        await db.insert(post_categories).values(postCategoryValues);
      }
      return newPost;
    }),
  updatePost: publicProcuder
    .input(PostUpdateValidate)
    .mutation(async ({ input }: { input: PostUpdateType }) => {
      const { id, categories: catNames, description, ...updateData } = input;

      const updatedPost = await db
        .update(posts)
        .set(updateData)
        .where(eq(posts.id, id))
        .returning();

      if (catNames && catNames.length > 0) {
        const categoryIds = await Promise.all(
          catNames.map(async (name) => {
            const existing = await db.query.categories.findFirst({
              where: (c, { eq }) => eq(c.name, name),
            });
            if (existing) return existing.id;
            const [newCat] = await db
              .insert(categories)
              .values({
                name,
                slug: name.toLowerCase(),
                description: description ?? "unknown",
              })
              .returning({ id: categories.id });

            return newCat.id;
          })
        );
        await db.delete(post_categories).where(eq(post_categories.postId, id));
        const postCategoryValues = categoryIds.map((catId) => ({
          postId: id,
          categoryId: catId,
        }));
        await db.insert(post_categories).values(postCategoryValues);
      } else {
        await db.delete(post_categories).where(eq(post_categories.postId, id));
      }
      await db
        .delete(categories)
        .where(
          notExists(
            db
              .select()
              .from(post_categories)
              .where(eq(post_categories.categoryId, categories.id))
          )
        );
      return updatedPost;
    }),
  deletePost: publicProcuder
    .input(z.object({ id: z.number(), userId: z.string() }))
    .mutation(async ({ input }) => {
      const { id, userId } = input;

      try {
        const existingPost = await db.query.posts.findFirst({
          where: and(eq(posts.id, id), eq(posts.authorId, userId)),
        });

        if (!existingPost) {
          console.log("Post not found or user is not the author", id, userId);
          return [];
        }

        console.log("Delete input:", id, userId);

        // 2️⃣ Delete related post_categories FIRST
        await db.delete(post_categories).where(eq(post_categories.postId, id));

        // 3️⃣ Delete the post AFTER child rows removed
        const deletedPost = await db.delete(posts).where(eq(posts.id, id));
        console.log("Deleted post result:", deletedPost);

        // 4️⃣ Delete orphan categories
        const orphanCategories = await db.query.categories.findMany({
          where: (c, { notExists }) =>
            notExists(
              db
                .select()
                .from(post_categories)
                .where(eq(post_categories.categoryId, c.id))
            ),
        });

        if (orphanCategories.length > 0) {
          await Promise.all(
            orphanCategories.map((cat) =>
              db.delete(categories).where(eq(categories.id, cat.id))
            )
          );
        }

        return deletedPost;
      } catch (err) {
        console.error("Delete failed:", err);
        throw new Error(
          "Post deletion failed: " +
            (err instanceof Error ? err.message : String(err))
        );
      }
    }),
});
