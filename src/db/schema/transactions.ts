import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  timestamp,
  date,
} from "drizzle-orm/pg-core";
import { organizations } from "./organizations.js";

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  payee: varchar("payee", { length: 255 }).notNull(),
  amountInPaise: integer("amount_in_paise").notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  date: date("date").notNull(),
  isDeleted: boolean("is_deleted").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  organization: integer("organization")
    .references(() => organizations.id)
    .notNull(),
});
