import { DATABASE_URL } from "#constants/env.js";
import { drizzle } from "drizzle-orm/neon-http";

const db = drizzle(DATABASE_URL);
export { db };
