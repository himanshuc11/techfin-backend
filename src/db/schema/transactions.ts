import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  timestamp,
  date,
  index,
} from "drizzle-orm/pg-core";
import { organizations } from "./organizations.js";

export const transactions = pgTable(
  "transactions",
  {
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
  },
  (transactions) => [
    index("transactions_payee_idx").on(transactions.payee),
    index("transactions_org_idx").on(transactions.organization),
    index("transactions_date_idx").on(transactions.date),
    index("transactions_category_idx").on(transactions.category),
    index("transactions_amount_idx").on(transactions.amountInPaise),
  ],
);
