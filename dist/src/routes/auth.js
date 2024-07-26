"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = require("express-rate-limit");
const register_1 = __importDefault(require("../controllers/auth/register"));
const login_1 = __importDefault(require("../controllers/auth/login"));
const Auth_1 = __importDefault(require("../middlewares/Auth"));
const user_1 = __importDefault(require("../services/user"));
const profile_1 = __importDefault(require("../services/profile"));
const profile_2 = __importDefault(require("../controllers/auth/profile"));
const password_1 = __importDefault(require("../controllers/auth/password"));
const AuthRouter = (0, express_1.Router)();
const userSvc = new user_1.default();
const profileSvc = new profile_1.default();
const registerCtlr = new register_1.default(userSvc, profileSvc);
const loginCtlr = new login_1.default(userSvc);
const profileCtlr = new profile_2.default();
const passwordCtlr = new password_1.default(userSvc);
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: "You can only make 10 requests every 15 minutes",
});
AuthRouter.route("/send-register-otp").all(registerCtlr.sendRegisterOtp, limiter);
AuthRouter.route("/register").all(registerCtlr.register, limiter);
AuthRouter.route("/login").all(loginCtlr.login, limiter);
AuthRouter.route("/me").all(Auth_1.default.isAuthenticatedUser, profileCtlr.getProfileDetails);
AuthRouter.route("/send-reset-password-otp").all(passwordCtlr.sendResetPasswordOtp, limiter);
AuthRouter.route("/reset-password").all(passwordCtlr.resetPassword, limiter);
exports.default = AuthRouter;
//# sourceMappingURL=auth.js.map