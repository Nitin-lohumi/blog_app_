import { router, publicProcuder } from "../trpc";
import { z } from "zod";
import { db } from "@/app/db";
import { post_categories } from "@/app/db/schema/Post_Categories";
import { posts } from "@/app/db/schema/PostSchema";
import { eq } from "drizzle-orm";

export const postCategoryRouter = router({
  deletePostCategory: publicProcuder
    .input(z.object({ id: z.number(), userId: z.string() }))
    .mutation(async ({ input }) => {
      const pc = await db.query.post_categories.findFirst({
        where: eq(post_categories.id, input.id),
      });

      if (!pc) return null;
      const post = await db.query.posts.findFirst({
        where: eq(posts.id, pc.postId),
      });

      if (!post) return null;

      if (post.authorId !== input.userId) {
        return null;
      }
      const deleted = await db
        .delete(post_categories)
        .where(eq(post_categories.id, input.id))
        .returning();

      return deleted;
    }),
});
