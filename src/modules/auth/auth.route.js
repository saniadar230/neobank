import express from "express";
import * as authController from "./auth.controller.js";
import * as authValidator from "./auth.validator.js";
import { validate } from "../../middlewares/validate.js";
const authRouter = express.Router();

authRouter.post(
  "/register",
  validate(authValidator.registerSchema, "body"),
  authController.register
);

authRouter.post(
  "/login",
  validate(authValidator.loginSchema, "body"),
  authController.login
);

authRouter.post(
  "/verify-email",
  validate(authValidator.verifyEmailSchema, "body"),
  authController.verifyEmail
);

authRouter.post(
  "/refresh-token",
  validate(authValidator.refreshTokenSchema, "cookies"),
  authController.refreshTokens
);

authRouter.post(
  "/logout",
  validate(authValidator.refreshTokenSchema, "cookies"),
  authController.logout
);

export default authRouter;
