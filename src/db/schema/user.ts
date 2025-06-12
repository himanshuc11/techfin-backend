import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

const UserTable = pgTable("users", {
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
});

export default UserTable;
