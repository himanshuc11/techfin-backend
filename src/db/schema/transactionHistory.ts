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
import { users } from "./users.js";
import { transactions } from "./transactions.js";

export const transactionHistory = pgTable("transaction_history", {
  id: serial("id").primaryKey(),
  payee: varchar("payee", { length: 255 }).notNull(),
  amountInPaise: integer("amount_in_paise").notNull(), // We need to store everything in paise (cents) to avoid floating point issues.
  category: varchar("category", { length: 255 }).notNull(),
  date: date("date").notNull(),
  isDeleted: boolean("is_deleted").default(false),
  updatedBy: integer("updated_by")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  organization: integer("organization")
    .references(() => organizations.id)
    .notNull(),
  transactionId: integer("transaction_id")
    .references(() => transactions.id)
    .notNull(),
});
