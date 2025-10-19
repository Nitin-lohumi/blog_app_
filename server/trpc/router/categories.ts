import { router, publicProcuder } from "../trpc";
import { z } from "zod";
import { db } from "@/app/db";
import { categories } from "@/app/db/schema/CategoriesSchema";
import { eq } from "drizzle-orm";

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
});

export const categoryRouter = router({
  getAllCategories: publicProcuder.query(async () => {
    return await db.query.categories.findMany();
  }),

  getCategoryById: publicProcuder
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.query.categories.findFirst({
        where: eq(categories.id, input.id),
      });
    }),

  createCategory: publicProcuder
    .input(CategoryValidate)
    .mutation(async ({ input }) => {
      return await db.insert(categories).values(input).returning();
    }),

  updateCategory: publicProcuder
    .input(CategoryUpdateValidate)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      return await db
        .update(categories)
        .set(updateData)
        .where(eq(categories.id, input.id))
        .returning();
    }),

  deleteCategory: publicProcuder
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db
        .delete(categories)
        .where(eq(categories.id, input.id))
        .returning();
    }),
});
