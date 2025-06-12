import dotenv from "dotenv";

dotenv.config({
  path: ".env.development",
});

const DATABASE_URL = process.env.DATABASE_URL!;

if (!DATABASE_URL) {
  throw new Error("ERROR: No DB URL");
}

export { DATABASE_URL };
