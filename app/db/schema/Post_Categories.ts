import { pgTable, serial, integer } from "drizzle-orm/pg-core";
import { posts } from "./PostSchema";
import { categories } from "./CategoriesSchema";

export const post_categories = pgTable("post_categories", {
  id: serial("id").primaryKey(),
  postId: integer("post_id")
    .references(() => posts.id)
    .notNull(),
  categoryId: integer("category_id")
    .references(() => categories.id)
    .notNull(),
});
