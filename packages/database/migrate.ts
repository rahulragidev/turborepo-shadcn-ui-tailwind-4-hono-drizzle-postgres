// packages/db/migrate.ts
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./index.js";

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migrations finished!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();
