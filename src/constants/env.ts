import dotenv from "dotenv";

dotenv.config({
  path: ".env.development",
});

const DATABASE_URL = process.env.DATABASE_URL!;
const JWT_TOKEN = process.env.JWT_SECRET!;

if (!DATABASE_URL) {
  throw new Error("ERROR: No DB URL");
}

export { DATABASE_URL, JWT_TOKEN };
