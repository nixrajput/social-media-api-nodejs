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

authRouter.route("/verify-account")
    .post(authController.verifyAccountOtp)
    .put(authController.verifyAccount);

authRouter.route("/validate-token")
    .get(isAuthenticatedUser, authController.validateToken);

export default authRouter;
