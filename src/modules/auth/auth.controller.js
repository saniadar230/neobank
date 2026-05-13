import * as authService from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res, next) => {
  const { first_name, last_name, email, username, password } = req.body;

  await authService.register(first_name, last_name, email, username, password);

  return res.status(201).json({
    success: true,
    message: "User was created successfully!",
  });
  // MIGRATION STRATEGIES - one way / upward - why do we use them
});
