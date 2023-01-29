import login from "./login/login.js";
import register from "./register/register.js";
import forgotPassword from "./forgot-password/forgotPassword.js";
import resetPassword from "./reset-password/resetPassword.js";
import logout from "./logout/logout.js";
import validateToken from "./validate-token/validateToken.js";
import sendOtpToEmail from "./verify-otp/sendOtpToEmail.js";
import verifyEmailOtp from "./verify-otp/verifyEmailOtp.js";
import sendOtpToPhone from "./verify-otp/sendOtpToPhone.js";
import verifyPhoneOtp from "./verify-otp/verifyPhoneOtp.js";
import sendRegisterOtp from "./register/sendRegisterOtp.js";
import validateUser from "./validate-user/validateUser.js";

const authController = {};

authController.login = login;
authController.register = register;
authController.forgotPassword = forgotPassword;
authController.resetPassword = resetPassword;
authController.logout = logout;
authController.validateToken = validateToken;
authController.sendOtpToEmail = sendOtpToEmail;
authController.verifyEmailOtp = verifyEmailOtp;
authController.sendOtpToPhone = sendOtpToPhone;
authController.verifyPhoneOtp = verifyPhoneOtp;
authController.sendRegisterOtp = sendRegisterOtp;
authController.validateUser = validateUser;

export default authController;
