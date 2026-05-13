import bcrypt from "bcrypt";
import { pool } from "../../db/db.js";
import { generateToken } from "../../utils/generateToken.js";
import { sendMail } from "../../config/mailer.js";
import AppError from "../../utils/AppError.js";

export const register = async (
  first_name,
  last_name,
  email,
  username,
  password
) => {
  // Validate there is no existing user with this email
  const existingUserWithEmail = await pool.query(
    `SELECT * FROM users WHERE email = $1;`,
    [email]
  );
  if (existingUserWithEmail.rowCount >= 1) {
    throw new AppError("User with this email already exists!", 409);
  }

  // Validate there is no existing user with this username
  const existingUserWithUsername = await pool.query(
    `SELECT * FROM users WHERE username = $1;`,
    [username]
  );
  if (existingUserWithUsername.rowCount >= 1) {
    throw new Error("User with this username already exists!", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user and validate the creation
  const createdUser = await pool.query(
    `INSERT INTO users (first_name,last_name,email,username,password)
      VALUES($1,$2,$3,$4,$5)
      RETURNING id, first_name, last_name, email, username`,
    [first_name, last_name, email, username, hashedPassword]
  );
  if (!createdUser.rowCount === 1) {
    throw new AppError("User creation failed", 500);
  }

  const user = createdUser.rows[0];
  // generate an alphanumeric string of length 6
  const token = generateToken(6);
  // expires after 15 mins
  const expires_at = new Date(Date.now() + 15 * 60 * 1000);

  // Create the email verification token
  const emailVerificationToken = await pool.query(
    `INSERT INTO email_verification_tokens(user_id, token, expires_at)
      VALUES($1,$2,$3)`,
    [user.id, token, expires_at]
  );
  if (!emailVerificationToken.rowCount === 1) {
    throw new AppError("Email Verification Token Creation Failed", 500);
  }

  // Send email with verification token
  await sendMail(
    user.email,
    "EMAIL VERIFICATION TOKEN (EXPIRES IN 15MINS)",
    `Following is your OTP code ${token}`
  );
};
