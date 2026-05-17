import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../db/db.js";
import {
  generateToken,
  generateRefreshToken,
} from "../../utils/generateToken.js";
import { sendMail } from "../../config/mailer.js";
import AppError, {
  AuthenticationError,
  BadRequestError,
} from "../../utils/AppError.js";
import { JWT_SECRET } from "../../config/env.js";
import { withTransaction } from "../../utils/withTransaction.js";

export const register = async (
  first_name,
  last_name,
  email,
  username,
  password
) => {
  // Validate there is no existing user with this email
  const existingUserWithEmail = await pool.query(
    `SELECT id FROM users WHERE email = $1;`,
    [email]
  );
  if (existingUserWithEmail.rowCount >= 1) {
    // this is to make the time taken to respond same as when there is no error, to prevent timing attacks
    await bcrypt.hash("dummyPassword", 10);
    throw new AppError(409, "User with this email already exists!");
  }

  // Validate there is no existing user with this username
  const existingUserWithUsername = await pool.query(
    `SELECT id FROM users WHERE username = $1;`,
    [username]
  );
  if (existingUserWithUsername.rowCount >= 1) {
    // this is to make the time taken to respond same as when there is no error, to prevent timing attacks
    await bcrypt.hash("dummyPassword", 10);
    throw new AppError(409, "User with this username already exists!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let user;
  let token;

  await withTransaction(async (client) => {
    const createdUser = await client.query(
      `INSERT INTO users (first_name,last_name,email,username,password)
        VALUES($1,$2,$3,$4,$5)
        RETURNING id, first_name, last_name, email, username`,
      [first_name, last_name, email, username, hashedPassword]
    );
    if (createdUser.rowCount !== 1) {
      throw new AppError(500, "User creation failed");
    }

    user = createdUser.rows[0];
    // generate an alphanumeric string of length 6
    token = generateToken(6);
    // expires after 15 mins
    const expires_at = new Date(Date.now() + 15 * 60 * 1000);

    // Create the email verification token
    const emailVerificationToken = await client.query(
      `INSERT INTO email_verification_tokens(user_id, token, expires_at)
      VALUES($1,$2,$3)`,
      [user.id, token, expires_at]
    );
    if (emailVerificationToken.rowCount !== 1) {
      throw new AppError(500, "Email Verification Token Creation Failed");
    }
  });
  // Send email with verification token
  await sendMail(
    user.email,
    "EMAIL VERIFICATION TOKEN (EXPIRES IN 15MINS)",
    `Following is your OTP code ${token}`
  );
};

export const login = async (email, password) => {
  // Validate user with this email exists and has a verified email
  const user = await pool.query(
    `SELECT id, role, password FROM users WHERE email = $1 AND is_email_verified = true;`,
    [email]
  );

  if (user.rowCount === 0) {
    await bcrypt.hash("dummyPassword", 10);
    throw new AuthenticationError("Invalid credentials");
  }

  // Compare users password with the password in DB
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.rows[0].password
  );
  if (!isPasswordCorrect) {
    throw new AuthenticationError("Invalid credentials");
  }

  // If user exists and password is correct, generate a jwt
  const jwtToken = jwt.sign(
    {
      sub: user.rows[0].id,
      role: user.rows[0].role,
    },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = generateRefreshToken();

  const createRefreshToken = await pool.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
    VALUES ($1, $2, NOW() + INTERVAL '24 hours')`,
    [user.rows[0].id, refreshToken]
  );

  if (createRefreshToken.rowCount !== 1) {
    throw new AppError(500, "Failed to create refresh token");
  }

  return { jwtToken, refreshToken };
};

export const verifyEmail = async (token, user_id) => {
  await withTransaction(async (client) => {
    // Check if this token exists for this user and is not expired
    const validToken = await client.query(
      `SELECT id FROM email_verification_tokens
      WHERE token = $1 AND user_id = $2 AND expires_at > NOW()`,
      [token, user_id]
    );

    if (validToken.rowCount === 0) {
      throw new BadRequestError("Invalid or expired token!");
    }
    // Mark the user's email as verified
    const deletedToken = await client.query(
      `DELETE FROM email_verification_tokens WHERE user_id = $1 AND token = $2`,
      [user_id, token]
    );

    if (deletedToken.rowCount === 0) {
      throw new AppError("Failed to delete email verification token", 500);
    }

    const updatedUser = await client.query(
      `UPDATE users SET is_email_verified = true WHERE id = $1 RETURNING id`,
      [user_id]
    );

    if (updatedUser.rowCount !== 1) {
      throw new AppError("Failed to verify email!", 500);
    }
  });
};

export const refreshTokens = async (refreshToken) => {
  // Validate the refresh token
  const refreshTokenRecord = await pool.query(
    `SELECT user_id, users.role 
     FROM refresh_tokens 
     JOIN users ON users.id = refresh_tokens.user_id
     WHERE token = $1 AND expires_at > NOW()`,
    [refreshToken]
  );

  if (refreshTokenRecord.rowCount === 0) {
    throw new AuthenticationError("Invalid or expired refresh token");
  }

  // If refresh token is valid, generate new access Token
  const newAccessToken = jwt.sign(
    {
      sub: refreshTokenRecord.rows[0].user_id,
      role: refreshTokenRecord.rows[0].role,
    },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  return { newAccessToken };
};

export const logout = async (refreshToken) => {
  const deletedToken = await pool.query(
    `DELETE FROM refresh_tokens WHERE token = $1`,
    [refreshToken]
  );

  if (deletedToken.rowCount !== 1) {
    throw new AuthenticationError("Invalid refresh token");
  }
};
