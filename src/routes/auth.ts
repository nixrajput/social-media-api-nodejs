/**
 * Define Auth Router
 */

import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import RegisterController from "../controllers/auth/register";
import LoginController from "../controllers/auth/login";
import AuthMiddleware from "../middlewares/Auth";
import UserService from "../services/user";
import ProfileService from "../services/profile";
import ProfileController from "../controllers/auth/profile";
import PasswordController from "../controllers/auth/password";

const AuthRouter: Router = Router();

const userSvc = new UserService();
const profileSvc = new ProfileService();
const registerCtlr = new RegisterController(userSvc, profileSvc);
const loginCtlr = new LoginController(userSvc);
const profileCtlr = new ProfileController();
const passwordCtlr = new PasswordController(userSvc);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "You can only make 10 requests every 15 minutes",
});

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for user authentication
 */

/**
 * @swagger
 * /api/v1/auth/send-register-otp:
 *   post:
 *     summary: Send OTP to register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fname
 *               - lname
 *               - email
 *               - username
 *               - password
 *               - confirmPassword
 *             properties:
 *               fname:
 *                 type: string
 *               lname:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *          description: First name is required
 *       500:
 *         description: Server error
 */
AuthRouter.route("/send-register-otp").all(
  registerCtlr.sendRegisterOtp,
  limiter
);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fname
 *               - lname
 *               - email
 *               - username
 *               - password
 *               - confirmPassword
 *               - otp
 *             properties:
 *               fname:
 *                 type: string
 *               lname:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *          description: First name is required
 *       500:
 *         description: Server error
 */
AuthRouter.route("/register").all(registerCtlr.register, limiter);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
AuthRouter.route("/login").all(loginCtlr.login, limiter);

// /**
//  * @name ProfileController.getProfileDetails
//  * @description Perform get profile detals.
//  * @route GET /api/v1/auth/me
//  * @access private
//  */
AuthRouter.route("/me").all(
  AuthMiddleware.isAuthenticatedUser,
  profileCtlr.getProfileDetails
);

// /**
//  * @name PasswordController.sendResetPasswordOtp
//  * @description Send OTP password reset.
//  * @route POST /api/v1/auth/send-reset-password-otp
//  * @access public
//  */
AuthRouter.route("/send-reset-password-otp").all(
  passwordCtlr.sendResetPasswordOtp,
  limiter
);

// /**
//  * @name PasswordController.resetPassword
//  * @description Reset the password.
//  * @route POST /api/v1/auth/reset-password
//  * @access public
//  */
AuthRouter.route("/reset-password").all(passwordCtlr.resetPassword, limiter);

export default AuthRouter;
