import { DATABASE_URL } from "#constants/env.js";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";

const sql = new Pool({ connectionString: DATABASE_URL! });
const db = drizzle(sql);

export { db };
