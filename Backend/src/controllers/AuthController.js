import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import verifyToken from "../utils/verificationToken.js";
import { generateToken } from "../utils/generateToken.js";
import {
  sendVerificationToken,
  sendResetPasswordToken,
  sendPasswordResetSuccess,
  sendWelcomeEmail,
} from "../email/sendEmail.js";
import crypto from "crypto";

// This file contains the code for the AuthController.

class AuthController {
  static async signup(req, res) {
    const { firstname, lastname, email, password } = req.body;

    try {
      if (!firstname || !lastname || !email || !password) {
        throw new Error("All fields are required");
      }

      const userExists = await User.findOne({email});
      if (userExists) {
        return res.status(400).json({
          status: "error",
          message: "User already exists",
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const verificationToken = verifyToken();

      const user = await User.create({
        firstname,
        lastname,
        email,
        password: hashPassword,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,  // 24 hours
      });

      await user.save();

      generateToken(res, { userId: user._id });

      sendVerificationToken(email, verificationToken);


      res.status(201).json({
        status: "success",
        message: "User created successfully",
        user: {
          ...user._doc,
          password: undefined,
        }
      });
    } catch (error) {
        res.status(500).json({
          status: "failed",
          error: error.message
        });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        throw new Error("All fields are required");
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "Invalid Email",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          status: "error",
          message: "Incorrect Password",
        })
      }

      generateToken(res, { userId: user._id });

      res.status(200).json({
        status: "success",
        message: "User logged in successfully",
        user: {
          ...user._doc,
          password: undefined,
        }
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        error: error.message
      });
    }
  }

  static async logout(req, res) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      status: "success",
      message: "User logged out successfully",
    });
  }
  
  static async checkAuth(req, res) {
    const { userId } = req.user;
    try {
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      }

      res.status(200).json({ 
        success: true, 
        message: "User Retrive successfully",
        user 
      });
    } catch (error) {
      console.log("Error in checkAuth ", error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async verifyEmail(req, res) {
    const { token } = req.body;

    try {
      if (!token) {
        throw new Error("Token is required");
      }

      const user = await User.findOne({ 
        verificationToken: token,
        verificationTokenExpiresAt: { $gt: Date.now() }, 
      });

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "Invalid or expired verification code"
        });
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;

      await user.save();

      sendWelcomeEmail(user.email, user.firstname, "http://localhost:3000/login");

      res.status(200).json({
        status: "success",
        message: "Email verified successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        error: error.message
      });
    }
  }

  static async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      if (!email) {
        throw new Error("Email is required");
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      const resetPasswordToken = crypto.randomBytes(20).toString("hex");
      const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000;  // 1 hours

      user.resetPasswordToken = resetPasswordToken;
      user.resetPasswordExpiresAt = resetPasswordExpiresAt;

      await user.save();

      // Send email with reset password link
      const resetUrl = `http://localhost:5173/reset-password/${resetPasswordToken}`;
      
      sendResetPasswordToken(email, resetUrl);

      res.status(200).json({
        status: "success",
        message: "Reset password link sent to your email",
      });


    } catch (error) {
      res.status(500).json({
        status: "failed",
        error: error.message
      })
    }
  }

  static async resetPassword(req, res) {
    const { password } = req.body;
    const { token } = req.params;

    try {
      if (!password) {
        throw new Error("All fields are required");
      }

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiresAt: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "Invalid or expired reset password token",
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      user.password = hashPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiresAt = undefined;

      await user.save();

      sendPasswordResetSuccess(user.email);

      res.status(200).json({
        status: "success",
        message: "Password reset successfully",
      });

    } catch (error) {
      res.status(500).json({
        status: "failed",
        error: error.message
      });
    }
  }
}

export default AuthController;