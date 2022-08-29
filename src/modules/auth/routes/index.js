import { Router } from "express";
import authController from "../controllers/index.js";

const authRouter = Router();

// Routes
authRouter.route("/register").post(authController.register);

authRouter.route("/login").post(authController.login);

authRouter.route("/logout").get(authController.logout);

authRouter.route("/forgot-password").post(authController.forgotPassword);

authRouter.route("/reset-password").post(authController.resetPassword);

authRouter.route("/verify-account")
    .post(authController.sendAccountVerificationEmail)
    .put(authController.verifyAccount);

export default authRouter;
