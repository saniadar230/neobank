import express from "express";
import cookieParser from "cookie-parser";
import { PORT } from "./config/env.js";
import { connectDatabase } from "./db/db.js";
import authRouter from "./modules/auth/auth.route.js";
import { verifyConnection } from "./config/mailer.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.get("/", (req, res, next) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
  await connectDatabase();
  await verifyConnection();
  console.log(`Server is running on port ${PORT}`);
});
