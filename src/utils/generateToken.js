import crypto from "crypto";

// generate an alphanumeric string of length 6
export function generateToken(length = 6) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const bytes = crypto.randomBytes(length);

  let token = "";

  for (let i = 0; i < length; i++) {
    token += chars[bytes[i] % chars.length];
  }

  return token;
}
