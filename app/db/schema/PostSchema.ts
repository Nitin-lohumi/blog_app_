import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  postPhoto: varchar("post_photo", { length: 500 }),
  slug: varchar("slug", { length: 255 }).notNull(),
  published: boolean("published").default(false).notNull(),
  author: varchar("author", { length: 255 }),
  authorId: varchar("author_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
