import login from "./login/login.js";
import register from "./register/register.js";
import forgotPassword from "./forgot-password/forgotPassword.js";
import resetPassword from "./reset-password/resetPassword.js";
import logout from "./logout/logout.js";

const authController = {};

authController.login = login;
authController.register = register;
authController.forgotPassword = forgotPassword;
authController.resetPassword = resetPassword;
authController.logout = logout;

export default authController;
