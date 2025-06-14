import { DATABASE_URL } from "#constants/env.js";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { Client, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const client = new Client(process.env.DATABASE_URL);
client.neonConfig.webSocketConstructor = ws;

const sql = new Pool({
  connectionString: DATABASE_URL!,
});

const db = drizzle(sql);

export { db };
