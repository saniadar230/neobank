import Joi from "joi";

export const registerSchema = Joi.object({
  first_name: Joi.string()
    .trim()
    .pattern(/^[A-Za-z]+$/)
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "First name cannot be empty",
      "string.pattern.base": "First name must only contain letters",
      "string.min": "First name must be at least 3 characters",
      "string.max": "First name cannot be more than 50 characters",
      "any.required": "First name is required",
    }),
  last_name: Joi.string()
    .trim()
    .pattern(/^[A-Za-z]+$/)
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "Last name cannot be empty",
      "string.pattern.base": "Last name must only contain letters",
      "string.min": "Last name must be at least 3 characters",
      "string.max": "Last name cannot be more than 50 characters",
      "any.required": "Last name is required",
    }),
  email: Joi.string()
    .trim()
    .pattern(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i)
    .required()
    .messages({
      "string.empty": "Email cannot be empty",
      "string.pattern.base": "Email is invalid",
      "any.required": "Email is required",
    }),
  username: Joi.string().trim().token().min(3).max(30).required().messages({
    "string.empty": "Username cannot be empty",
    "string.token":
      "Username can only contain alphabets, numbers and underscore",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username cannot be more than 30 characters",
    "any.required": "Username is required",
  }),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be min 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character!",
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().required().messages({
    "string.empty": "Email cannot be empty",
    "any.required": "Email is required",
  }),
  password: Joi.string().trim().required().messages({
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }),
});

export const verifyEmailSchema = Joi.object({
  token: Joi.string().trim().alphanum().length(6).required().messages({
    "string.empty": "    cannot be empty",
    "string.alphanum": "OTP must be alphanumeric",
    "string.length": "OTP must be 6 characters",
    "any.required": "OTP is required",
  }),
  user_id: Joi.string().uuid().required().messages({
    "string.empty": "User ID cannot be empty",
    "string.uuid": "User ID must be a valid UUID",
    "any.required": "User ID is required",
  }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .length(128) // 64 bytes hex = 128 chars
    .hex()
    .required()
    .messages({
      "string.empty": "Refresh token cannot be empty",
      "any.required": "Refresh token is required",
      "string.length": "Refresh token must be 128 characters",
      "string.hex": "Refresh token must be a valid hex string",
    }),
});
