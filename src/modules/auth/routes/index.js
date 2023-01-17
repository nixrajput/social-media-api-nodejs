import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.js";
import authController from "../controllers/index.js";

const isAuthenticatedUser = authMiddleware.isAuthenticatedUser;

const authRouter = Router();


/// @route   POST /api/v1/register
authRouter.route("/register")
    .post(authController.register);

/// @route   POST /api/v1/login
authRouter.route("/login")
    .post(authController.login);

/// @route   POST /api/v1/logout
authRouter.route("/logout")
    .get(authController.logout);

/// @route   POST /api/v1/forgot-password
authRouter.route("/forgot-password")
    .post(authController.forgotPassword);

/// @route   POST /api/v1/reset-password
authRouter.route("/reset-password")
    .post(authController.resetPassword);

/// @route   POST /api/v1/validate-token
authRouter.route("/validate-token")
    .get(isAuthenticatedUser, authController.validateToken);

/// @route   POST /api/v1/send-otp-to-email
authRouter.route("/send-otp-to-email")
    .post(authController.sendOtpToEmail);

/// @route   POST /api/v1/send-verify-email-otp
authRouter.route("/send-verify-email-otp")
    .post(authController.sendVerifyEmailOtp);

/// @route   POST /api/v1/verify-email-otp
authRouter.route("/verify-email-otp")
    .post(authController.verifyEmailOtp);

/// @route   POST /api/v1/send-otp-to-phone
authRouter.route("/send-otp-to-phone")
    .post(authController.sendOtpToPhone);

/// @route   POST /api/v1/verify-phone-otp
authRouter.route("/verify-phone-otp")
    .post(authController.verifyPhoneOtp);

export default authRouter;