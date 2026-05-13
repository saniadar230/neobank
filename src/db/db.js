import { Pool } from "pg";
import {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
} from "../config/env.js";

export const pool = new Pool({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
});

export const connectDatabase = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("DB connected at:", result.rows[0].now);
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};
