import { router, publicProcuder } from "../trpc";
import { z } from "zod";
import { db } from "@/app/db";
import { posts } from "@/app/db/schema/PostSchema";
import { eq } from "drizzle-orm";
import { supabaseAdmin } from "@/utils/serverClient/supabaseServer";
// import { TRPCError } from "@trpc/server";

const PostValidate = z.object({
  title: z.string().min(1, "Title required"),
  content: z.string().min(1, "Content required"),
  postPhoto: z.string().optional(),
  slug: z.string().min(1, "Slug required"),
  published: z.boolean().default(false),
  author: z.string().min(1, "Author required"),
  authorId: z.string().min(1, "Author ID required"),
  createdAt: z.string().min(1, "CreatedAt required"),
  updatedAt: z.string().min(1, "UpdatedAt required"),
});

const PostUpdateValidate = z.object({
  id: z.number(),
  title: z.string().optional(),
  content: z.string().optional(),
  postPhoto: z.string().optional(),
  slug: z.string().optional(),
  published: z.boolean().optional(),
  author: z.string().optional(),
  authorId: z.string().optional(),
  updatedAt: z.string().min(1, "UpdatedAt required"),
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
  getAllPost: publicProcuder.query(async () => {
    const allPosts = await db.query.posts.findMany();
    return allPosts;
  }),

  getPostById: publicProcuder
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const post = await db.query.posts.findFirst({
        where: eq(posts.id, input.id),
      });
      return post;
    }),

  createPost: publicProcuder
    .input(PostValidate)
    .mutation(async ({ input }: { input: PostInputType }) => {
      const newPost = await db.insert(posts).values(input).returning();
      return newPost;
    }),

  updatePost: publicProcuder
    .input(PostUpdateValidate)
    .mutation(async ({ input }: { input: PostUpdateType }) => {
      const { id, ...updateData } = input;
      const updatedPost = await db
        .update(posts)
        .set(updateData)
        .where(eq(posts.id, id))
        .returning();
      return updatedPost;
    }),

  deletePost: publicProcuder
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const deletedPost = await db
        .delete(posts)
        .where(eq(posts.id, input.id))
        .returning();
      return deletedPost;
    }),
});
