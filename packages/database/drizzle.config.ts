// packages/db/drizzle.config.ts
import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config(); // load DATABASE_URL from .env if present

export default {
  schema: "./schema.ts",
  out: "./drizzle", // directory to put migration files
  dialect: "postgresql", // using postgres (pg) driver
  dbCredentials: {
    url: process.env.DATABASE_URL + "?sslmode=require" || "",
    ssl: {
      rejectUnauthorized: false,
    },
  },
} satisfies Config;
