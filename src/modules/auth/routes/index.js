import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.js";
import authController from "../controllers/index.js";

const isAuthenticatedUser = authMiddleware.isAuthenticatedUser;

const authRouter = Router();

// Routes
authRouter.route("/register").post(authController.register);

authRouter.route("/login").post(authController.login);

authRouter.route("/logout").get(authController.logout);

authRouter.route("/forgot-password").post(authController.forgotPassword);

authRouter.route("/reset-password").post(authController.resetPassword);

authRouter.route("/validate-token")
    .get(isAuthenticatedUser, authController.validateToken);

authRouter.route("/send-otp-to-email")
    .post(authController.sendOtpToEmail);

authRouter.route("/verify-email-otp")
    .post(authController.verifyEmailOtp);

authRouter.route("/send-otp-to-phone")
    .post(authController.sendOtpToPhone);

authRouter.route("/verify-phone-otp")
    .post(authController.verifyPhoneOtp);

export default authRouter;