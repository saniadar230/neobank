import { trimWhitespaces } from "../../utils/trimWhitespaces.js";
import { ValidationError } from "../../utils/AppError";

export const validateFirstName = (first_name) => {
  if (!first_name) {
    throw next(new ValidationError("First name is required"));
  }
  const name = first_name.trim();

  if (name.length < 3 || name.length > 50) {
    throw new ValidationError("First name must be between 3 and 50 characters");
  }

  if (!/^[A-Za-z]+$/.test(name)) {
    throw new ValidationError("First Name must contain only characters");
  }
};

export const validateLastName = (last_name) => {
  if (!last_name) return;

  const name = last_name.trim();

  if (name.length < 3 || name.length > 50) {
    throw new ValidationError("Last Name must be between 3 and 50 characters");
  }

  if (!/^[A-Za-z]+$/.test(name)) {
    throw new ValidationError("Last Name must contain only characters");
  }
};

export const validateEmail = (email) => {
  if (!email) throw new ValidationError("Email is required");

  if (!/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(email)) {
    throw new Error("Email is not valid");
  }
};

export const validateUsername = (username) => {
  if (!username) throw new ValidationError("Username is required");

  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  if (!usernameRegex.test(username)) {
    throw new ValidationError(
      "Username must contain only characters, numbers or underscores and can only be between 3 and 30 characters long"
    );
  }
};

export const validatePassword = (password) => {
  if (!password) throw new ValidationError("Password is required");

  //Must include:
  // at least 1 lowercase letter
  // at least 1 uppercase letter
  // at least 1 number
  // at least 1 special character
  // 8 to 64 characters
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;
  if (!passwordRegex.test(password)) {
    throw new ValidationError(
      "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character"
    );
  }
};

export const validateRegister = (req, res, next) => {
  // Validate request body is an object
  if (!req.body || typeof req.body !== "object") {
    throw new ValidationError("Invalid request body");
  }

  // Trim whitespaces
  for (const key of Object.keys(req.body)) {
    if (typeof req.body[key] !== "string")
      throw new ValidationError(`${key} must be a string`);
    req.body[key] = trimWhitespaces(req.body[key]);
  }

  const { first_name, last_name, email, username, password } = req.body;

  validateFirstName(first_name);
  validateLastName(last_name);
  validateEmail(email);
  validateUsername(username);
  validatePassword(password);

  next();
};
