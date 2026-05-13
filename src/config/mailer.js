import nodemailer from "nodemailer";
import { SMTP_PASS, SMTP_USER, MAIL_HOST, MAIL_FROM } from "./env.js";

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: 2525,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log("Server is ready to take our messages");
  } catch (err) {
    console.error("Verification failed:", err);
  }
};

export const sendMail = async (to, subject, text) => {
  const info = await transporter.sendMail({
    from: `"Example Team" <${MAIL_FROM}>`, // sender address
    to: `${to}`, // list of recipients
    subject: `${subject}`, // subject line
    text: `${text}`, // plain text body
  });
  console.log("Message sent: %s", info.messageId);
};
