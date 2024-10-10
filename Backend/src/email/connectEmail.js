import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const userEmail = process.env.EMAIL_USER;
const userPass = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: `${userEmail}`,
    pass: `${userPass}`,
  },
});

export default transporter;