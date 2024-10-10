import express from "express";
import AuthController from "../controllers/AuthController.js";
import verifyToken from "../middleware/verifyToken.js";
import passport from "../middleware/passport.js";
import { generateToken } from "../utils/generateToken.js";


const authRoutes = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: User Signup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: User created successfully
 *       '400':
 *         description: User already exists or validation error
 */
authRoutes.post("/signup", AuthController.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *       '400':
 *         description: Invalid email or password
 */
authRoutes.post("/login", AuthController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User Logout
 *     responses:
 *       '200':
 *         description: User logged out successfully
 */
authRoutes.post("/logout", AuthController.logout);

/**
 * @swagger
 * /auth/check-auth:
 *   get:
 *     summary: Check Authentication
 *     responses:
 *       '200':
 *         description: User is authenticated
 *       '401':
 *         description: User is not authenticated
 */
authRoutes.get("/check-auth", verifyToken, AuthController.checkAuth);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify Email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *             required:
 *               - token
 *     responses:
 *       '200':
 *         description: Email verified successfully
 *       '400':
 *         description: Invalid or expired token
 */
authRoutes.post("/verify-email", AuthController.verifyEmail);

/**
 * @swagger
 * /auth/forget-password:
 *   post:
 *     summary: Forget Password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       '200':
 *         description: Reset link sent to email
 *       '400':
 *         description: Error sending reset link
 */
authRoutes.post("/forget-password", AuthController.forgotPassword);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Reset Password
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *             required:
 *               - password
 *     responses:
 *       '200':
 *         description: Password reset successfully
 *       '400':
 *         description: Invalid or expired token
 */
authRoutes.post("/reset-password/:token", AuthController.resetPassword);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Google OAuth
 *     responses:
 *       '302':
 *         description: Redirect to Google OAuth
 */
authRoutes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth Callback
 *     responses:
 *       '302':
 *         description: Redirect to home page after successful authentication
 *       '400':
 *         description: Failed to authenticate with Google
 */
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    // Generate and send JWT tokens
    generateToken(res, req.user.id);
    res.redirect("http://localhost:5173/");
  }
);


export default authRoutes;