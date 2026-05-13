import { pool } from "./db.js";
import fs from "fs/promises";
import path from "path";

async function migrateDatabase() {
  try {
    const __dirname = import.meta.dirname;
    const pathName = path.join(__dirname, "migrations");

    const files = await fs.readdir(pathName, "utf-8");

    await pool.query(`CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    filename TEXT UNIQUE NOT NULL,
    ran_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);

    for (const file of files) {
      await pool.query("BEGIN");

      const filePath = path.join(pathName, file);
      const sql = await fs.readFile(filePath, "utf-8");

      const rows = await pool.query(
        "SELECT filename FROM migrations ORDER BY ran_at ASC"
      );

      const alreadyRun = rows.rows.find((r) => r.filename === file);
      if (alreadyRun) continue;

      try {
        await pool.query(sql);
        await pool.query("COMMIT");
        await pool.query(`INSERT into migrations(filename) VALUES('${file}')`);
        console.log(`Done: ${file}`);
      } catch (err) {
        await pool.query("ROLLBACK");
        console.error(`Failed: ${file}`, err);
        throw err;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

await migrateDatabase();
