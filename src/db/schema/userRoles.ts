import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  role: varchar("role", { length: 100 }).notNull(),
});
