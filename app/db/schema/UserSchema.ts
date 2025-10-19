import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";

export const user = pgTable("Users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: text("email").unique().notNull(),
});
