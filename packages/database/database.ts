import pg from 'pg';
const { Pool } = pg;

import { drizzle } from "drizzle-orm/node-postgres";
import * as dotenv from "dotenv";
import * as schema from "./schema.js";

dotenv.config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // You can also set pool options like max connections, idle timeout, etc.
});
export const db = drizzle(pool, { schema });