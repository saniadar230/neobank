import express from "express";
import * as authController from "./auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", (req, res, next) => {
  res.send("LOGIN");
});

authRouter.post("/logout", (req, res, next) => {
  res.send("LOGOUT");
});

export default authRouter;
