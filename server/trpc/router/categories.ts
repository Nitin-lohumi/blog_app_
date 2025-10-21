import { router, publicProcuder } from "../trpc";
import { z } from "zod";
import { db } from "@/app/db";
import { categories } from "@/app/db/schema/CategoriesSchema";
import { and, eq } from "drizzle-orm";
import { post_categories } from "@/app/db/schema/Post_Categories";
import { posts } from "@/app/db/schema/PostSchema";

const CategoryValidate = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  slug: z.string().min(1),
});

const CategoryUpdateValidate = z.object({
  id: z.number(),
  name: z.string().optional(),
  description: z.string().optional(),
  slug: z.string().optional(),
  userId: z.string().nonempty(),
  postId: z.number().nonoptional(),
});

export const categoryRouter = router({
  getAllCategories: publicProcuder.query(async () => {
    return await db.query.categories.findMany();
  }),

  getCategoriesByPostId: publicProcuder
    .input(z.object({ postId: z.number() }))
    .query(async ({ input }) => {
      const { postId } = input;
      const getAllCat = await db.query.post_categories.findMany({
        where: (pc, { eq }) => eq(pc.postId, postId),
      });
      const categoriesData = await Promise.all(
        getAllCat.map(async (pc) => {
          const cat = await db.query.categories.findFirst({
            where: (c, { eq }) => eq(c.id, pc.categoryId),
          });
          return cat;
        })
      );
      return categoriesData;
    }),

  getCategoryById: publicProcuder
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.query.categories.findFirst({
        where: eq(categories.id, input.id),
      });
    }),

  AddCategory: publicProcuder
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string().optional(),
        slug: z.string(),
        userId: z.string().nonempty(),
        postId: z.number().nonoptional(),
      })  
    )
    .mutation(async ({ input }) => {
      const { id, postId, userId, ...restUpdate } = input;

      const isvaliduserOfPost = await db.query.posts.findFirst({
        where: (post, { eq, and }) =>
          and(eq(post.id, postId), eq(post.authorId, userId)),
      });

      const isvalidjuntion = await db.query.post_categories.findFirst({
        where: (pc, { eq }) => eq(pc.postId, postId),
      });

      if (!isvaliduserOfPost) {
        return "no data found! invalid Call to update Category";
      }
      if (isvalidjuntion) {
        return "this catagory already  avaiable ";
      }
      const cat = await db.insert(categories).values(restUpdate).returning();
      await db
        .insert(post_categories)
        .values({ postId: postId, categoryId: cat[0].id });
      return cat;
    }),

  updateCategory: publicProcuder
    .input(CategoryUpdateValidate)
    .mutation(async ({ input }) => {
      const { id, userId, postId, ...updateData } = input; //you have to send id , useri,postid
      const isvaliduserOfPost = await db.query.posts.findFirst({
        where: (post, { eq, and }) =>
          and(eq(post.id, postId), eq(post.authorId, userId)),
      });
      const isvalidjuntion = await db.query.post_categories.findFirst({
        where: (pc, { eq, and }) =>
          and(eq(pc.postId, postId), eq(pc.categoryId, id)),
      });
      if (!isvaliduserOfPost || !isvalidjuntion) {
        return "no data found! invalid Call to update Category";
      }
      return await db
        .update(categories)
        .set(updateData)
        .where(and(eq(categories.id, id), eq(categories.id, input.id)))
        .returning();
    }),

  deleteCategory: publicProcuder
    .input(z.object({ id: z.number(), userId: z.string(), postId: z.number() }))
    .mutation(async ({ input }) => {
      const { id, userId, postId } = input;
      const isvaliduserOfPost = await db.query.posts.findFirst({
        where: (post, { eq, and }) =>
          and(eq(post.id, postId), eq(post.authorId, userId)),
      });
      const isvalidjuntion = await db.query.post_categories.findFirst({
        where: (pc, { eq, and }) =>
          and(eq(pc.postId, postId), eq(pc.categoryId, id)),
      });
      if (!isvaliduserOfPost || !isvalidjuntion) {
        return "no data found! invalid Call to delete Category";
      }
      await db
        .delete(post_categories)
        .where(
          and(
            eq(post_categories.postId, postId),
            eq(post_categories.categoryId, id)
          )
        );
      const stillLinked = await db.query.post_categories.findFirst({
        where: (pc, { eq }) => eq(pc.categoryId, id),
      });

      if (!stillLinked) {
        return await db
          .delete(categories)
          .where(eq(categories.id, id))
          .returning();
      }
      return {
        message: "✅ Category unlinked from post!.",
      };
    }),
});
