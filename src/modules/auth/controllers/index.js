import login from "./login/login.js";
import register from "./register/register.js";
import forgotPassword from "./forgot-password/forgotPassword.js";
import resetPassword from "./reset-password/resetPassword.js";
import logout from "./logout/logout.js";
import verifyAccountOtp from "./verify-account/verifyAccountOtp.js";
import verifyAccount from "./verify-account/verifyAccount.js";
import validateToken from "./validate-token/validateToken.js";
import getLocationInfoFromIp from "./register/getLocationInfo.js";

const authController = {};

authController.login = login;
authController.register = register;
authController.forgotPassword = forgotPassword;
authController.resetPassword = resetPassword;
authController.logout = logout;
authController.verifyAccountOtp = verifyAccountOtp;
authController.verifyAccount = verifyAccount;
authController.validateToken = validateToken;
authController.getLocationInfoFromIp = getLocationInfoFromIp;

export default authController;
