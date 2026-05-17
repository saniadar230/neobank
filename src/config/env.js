import dotenv from "dotenv";
dotenv.config();
export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;

// Database configuration
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_NAME = process.env.DB_NAME;

// SMTP configuration
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;
export const MAIL_HOST = process.env.MAIL_HOST;
export const MAIL_FROM = process.env.MAIL_FROM;

// JWT configuration
export const JWT_SECRET = process.env.JWT_SECRET;
