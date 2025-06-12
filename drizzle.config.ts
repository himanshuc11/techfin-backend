import { DATABASE_URL } from "#constants/env.js";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url: DATABASE_URL!,
  },
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/db/schema/index.ts",
});
