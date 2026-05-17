import * as authService from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { NODE_ENV } from "../../config/env.js";

export const register = asyncHandler(async (req, res, next) => {
  const { first_name, last_name, email, username, password } = req.body;

  await authService.register(first_name, last_name, email, username, password);

  return sendSuccess(
    res,
    null,
    201,
    "User registered successfully. Please check your email to verify your account."
  );
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true, // protects against xss cookie theft (i.e js cannot access this cookie)
    secure: NODE_ENV === "production", // ensures cookie is only sent over https in production
    sameSite: "strict", // protects against csrf (prevents cookie from being sent in cross-site requests)
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in ms
    path: "/api/v1/auth", // cookie will only be sent to this endpoint
  });
  return sendSuccess(res, result.jwtToken, 200, "Login successful");
});

export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token, user_id } = req.body;

  await authService.verifyEmail(token, user_id);

  return sendSuccess(
    res,
    null,
    200,
    "Email verified successfully. You can now login to your account."
  );
});

export const refreshTokens = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  const result = await authService.refreshTokens(refreshToken);

  return sendSuccess(
    res,
    result.newAccessToken,
    200,
    "Access token refreshed successfully"
  );
});

export const logout = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  await authService.logout(refreshToken);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/v1/auth",
  });
  return sendSuccess(res, null, 200, "Logged out successfully");
});
