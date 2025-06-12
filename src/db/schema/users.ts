import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { organizations } from "./organizations.js";
import { userRoles } from "./userRoles.js";

export const users = pgTable("techfin_users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: integer("role")
    .references(() => userRoles.id)
    .notNull(),
  organization: integer("organization")
    .references(() => organizations.id)
    .notNull(),
});
