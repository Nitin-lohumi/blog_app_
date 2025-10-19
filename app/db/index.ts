import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { categories } from "./schema/CategoriesSchema";
import { post_categories } from "./schema/Post_Categories";
import { posts } from "./schema/PostSchema";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: { categories, post_categories, posts },
});
