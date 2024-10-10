import transporter from "./connectEmail.js";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  WELCOME_TEMPLATE,
} from "./emailTemplate.js";

export const sendVerificationToken = (email, token) => {
  const mailOptions = {
    from: "Bamiwo",
    to: email,
    subject: "Verify your email",
    text: "Thank you for signing up!",
    html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", token),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log({ error: error.message });
    }
    console.log({ message: "Email sent successfully!" });
  });
}

export const sendResetPasswordToken = (email, resetUrl) => {
  const mailOptions = {
    from: "Bamiwo",
    to: email,
    subject: "Reset your password",
    text: "You are receiving this because you (or someone else) have requested the reset of the password for your account.",
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log({ error: error.message });
    }
    console.log({ message: "Email sent successfully!" });
  });
}

export const sendPasswordResetSuccess = (email) => {
  const mailOptions = {
    from: "Bamiwo",
    to: email,
    subject: "Password reset successful",
    text: "We're writing to confirm that your password has been successfully reset.",
    html: PASSWORD_RESET_SUCCESS_TEMPLATE,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log({ error: error.message });
    }
    console.log({ message: "Email sent successfully!" });
  });
}

export const sendWelcomeEmail = (email, username, loginUrl) => {
  const mailOptions = {
    from: "Bamiwo",
    to: email,
    subject: "Welcome to Bamiwo",
    text: "Thank you for signing up!",
    html: WELCOME_TEMPLATE.replace("{user}", username).replace("{loginURL}", loginUrl),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log({ error: error.message });
    }
    console.log({ message: "Email sent successfully!" });
  });
}