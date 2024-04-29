/**
 * Define Auth Router
 */

import { Router } from "express";
import RegisterController from "./RegisterController";
import LoginController from "./LoginController";
import AuthMiddleware from "../../middlewares/Auth";
import UserService from "../../services/UserService";
import ProfileService from "../../services/ProfileService";
import ProfileController from "./ProfileController";
import PasswordController from "./PasswordController";

const AuthRouter: Router = Router();

const userSvc = new UserService();
const profileSvc = new ProfileService();
const registerCtlr = new RegisterController(userSvc, profileSvc);
const loginCtlr = new LoginController(userSvc);
const profileCtlr = new ProfileController();
const passwordCtlr = new PasswordController(userSvc);

/**
 * @name RegisterController.sendRegisterOtp
 * @description Send OTP for registration.
 * @route POST /api/v1/auth/send-register-otp
 * @access public
 */
AuthRouter.route("/send-register-otp").all(registerCtlr.sendRegisterOtp);

/**
 * @name RegisterController.register
 * @description Create a new account.
 * @route POST /api/v1/auth/register
 * @access public
 */
AuthRouter.route("/register").all(registerCtlr.register);

/**
 * @name LoginController.login
 * @description Create a new account.
 * @route POST /api/v1/auth/login
 * @access public
 */
AuthRouter.route("/login").all(loginCtlr.login);

/**
 * @name ProfileController.getProfileDetails
 * @description Perform get profile detals.
 * @route GET /api/v1/auth/me
 * @access private
 */
AuthRouter.route("/me").all(
  AuthMiddleware.isAuthenticatedUser,
  profileCtlr.getProfileDetails
);

/**
 * @name PasswordController.sendResetPasswordOtp
 * @description Send OTP password reset.
 * @route POST /api/v1/auth/send-reset-password-otp
 * @access public
 */
AuthRouter.route("/send-reset-password-otp").all(
  passwordCtlr.sendResetPasswordOtp
);

/**
 * @name PasswordController.resetPassword
 * @description Reset the password.
 * @route POST /api/v1/auth/reset-password
 * @access public
 */
AuthRouter.route("/reset-password").all(passwordCtlr.resetPassword);

export default AuthRouter;
