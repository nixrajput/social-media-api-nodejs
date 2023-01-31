import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.js";
import authController from "../controllers/index.js";

const isAuthenticatedUser = authMiddleware.isAuthenticatedUser;

const authRouter = Router();

/// @route  POST /api/v1/register
/// @desc   Register a user
/// @access Public
authRouter.route("/register")
    .post(authController.register);

/// @route  POST /api/v1/send-register-otp
/// @desc   Send register OTP
/// @access Public
authRouter.route("/send-register-otp")
    .post(authController.sendRegisterOtp);

/// @route  POST /api/v1/login
/// @desc   Login a user
/// @access Public
authRouter.route("/login")
    .post(authController.login);

/// @route  POST /api/v1/validate-user
/// @desc   Validate user
/// @access Public
authRouter.route("/validate-user")
    .post(authController.validateUser);

/// @route  POST /api/v1/logout
/// @desc   Logout a user
/// @access Private
authRouter.route("/logout")
    .get(isAuthenticatedUser, authController.logout);

/// @route  POST /api/v1/forgot-password
/// @desc   Forgot password
/// @access Public
authRouter.route("/forgot-password")
    .post(authController.forgotPassword);

/// @route  POST /api/v1/reset-password
/// @desc   Reset password
/// @access Public
authRouter.route("/reset-password")
    .post(authController.resetPassword);

/// @route  POST /api/v1/validate-token
/// @desc   Validate token
/// @access Private
authRouter.route("/validate-token")
    .get(isAuthenticatedUser, authController.validateToken);

/// @route  POST /api/v1/send-otp-to-email
/// @desc   Send OTP to email
/// @access Public
authRouter.route("/send-otp-to-email")
    .post(authController.sendOtpToEmail);

/// @route  POST /api/v1/verify-email-otp
/// @desc   Verify email OTP
/// @access Public
authRouter.route("/verify-email-otp")
    .post(authController.verifyEmailOtp);

/// @route  POST /api/v1/send-otp-to-phone
/// @desc   Send OTP to phone
/// @access Public
authRouter.route("/send-otp-to-phone")
    .post(authController.sendOtpToPhone);

/// @route  POST /api/v1/verify-phone-otp
/// @desc   Verify phone OTP
/// @access Public
authRouter.route("/verify-phone-otp")
    .post(authController.verifyPhoneOtp);

export default authRouter;