"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../enums");
const ApiError_1 = __importDefault(require("../../exceptions/ApiError"));
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const strings_1 = __importDefault(require("../../constants/strings"));
const logger_1 = __importDefault(require("../../logger"));
const validator_1 = __importDefault(require("../../utils/validator"));
const OtpServiceHelper_1 = __importDefault(require("../../helpers/OtpServiceHelper"));
const MailTemplateHelper_1 = __importDefault(require("../../helpers/MailTemplateHelper"));
const MailServiceHelper_1 = __importDefault(require("../../helpers/MailServiceHelper"));
const Otp_1 = __importDefault(require("../../models/Otp"));
class PasswordController {
    userSvc;
    _userSvc;
    constructor(userSvc) {
        this.userSvc = userSvc;
        this._userSvc = userSvc;
    }
    sendResetPasswordOtp = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.POST) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        try {
            const { email, password, confirmPassword, } = req.body;
            if (!email) {
                return next(new ApiError_1.default(strings_1.default.EMAIL_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (!validator_1.default.validateEmail(email)) {
                return next(new ApiError_1.default(strings_1.default.INVALID_EMAIL_FORMAT, statusCodes_1.default.BAD_REQUEST));
            }
            if (!password) {
                return next(new ApiError_1.default(strings_1.default.PASSWORD_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (password.length < 8) {
                return next(new ApiError_1.default(strings_1.default.PASSWORD_MIN_LENGTH_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            if (password.length > 32) {
                return next(new ApiError_1.default(strings_1.default.PASSWORD_MAX_LENGTH_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            if (!confirmPassword) {
                return next(new ApiError_1.default(strings_1.default.CONFIRM_PASSWORD_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (confirmPassword.length < 8) {
                return next(new ApiError_1.default(strings_1.default.CONFIRM_PASSWORD_MIN_LENGTH_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            if (confirmPassword.length > 32) {
                return next(new ApiError_1.default(strings_1.default.CONFIRM_PASSWORD_MAX_LENGTH_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            if (password.trim() !== confirmPassword.trim()) {
                return next(new ApiError_1.default(strings_1.default.PASSWORDS_DO_NOT_MATCH, statusCodes_1.default.BAD_REQUEST));
            }
            const _email = email?.toLowerCase().trim();
            const isEmailExists = await this._userSvc.checkIsEmailExistsExc(_email);
            if (!isEmailExists) {
                return next(new ApiError_1.default(strings_1.default.EMAIL_NOT_REGISTERED, statusCodes_1.default.BAD_REQUEST));
            }
            const newOtp = await OtpServiceHelper_1.default.generateOtpFromEmail(_email);
            if (!newOtp) {
                return next(new ApiError_1.default(strings_1.default.OTP_CREATE_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            const currentUser = await this._userSvc.findUserByEmailExc(_email);
            const htmlMessage = await MailTemplateHelper_1.default.getOtpEmail(newOtp.otp, `${currentUser.fname} ${currentUser.lname}`);
            if (htmlMessage) {
                await MailServiceHelper_1.default.sendEmail({
                    to: _email,
                    subject: "OTP For Password Reset",
                    htmlContent: htmlMessage,
                });
            }
            res.status(statusCodes_1.default.OK);
            return res.json({
                success: true,
                message: strings_1.default.SUCCESS,
            });
        }
        catch (error) {
            const errorMessage = error?.message || error || strings_1.default.SOMETHING_WENT_WRONG;
            logger_1.default.getInstance().error("PasswordController: sendResetPasswordOtp", "errorInfo:" + JSON.stringify(error));
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: errorMessage,
            });
        }
    };
    resetPassword = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.POST) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        try {
            const { email, password, confirmPassword, otp, } = req.body;
            if (!email) {
                return next(new ApiError_1.default(strings_1.default.EMAIL_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (!validator_1.default.validateEmail(email)) {
                return next(new ApiError_1.default(strings_1.default.INVALID_EMAIL_FORMAT, statusCodes_1.default.BAD_REQUEST));
            }
            if (!password) {
                return next(new ApiError_1.default(strings_1.default.PASSWORD_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (password.length < 8) {
                return next(new ApiError_1.default(strings_1.default.PASSWORD_MIN_LENGTH_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            if (password.length > 32) {
                return next(new ApiError_1.default(strings_1.default.PASSWORD_MAX_LENGTH_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            if (!confirmPassword) {
                return next(new ApiError_1.default(strings_1.default.CONFIRM_PASSWORD_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (confirmPassword.length < 8) {
                return next(new ApiError_1.default(strings_1.default.CONFIRM_PASSWORD_MIN_LENGTH_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            if (confirmPassword.length > 32) {
                return next(new ApiError_1.default(strings_1.default.CONFIRM_PASSWORD_MAX_LENGTH_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            if (password.trim() !== confirmPassword.trim()) {
                return next(new ApiError_1.default(strings_1.default.PASSWORDS_DO_NOT_MATCH, statusCodes_1.default.BAD_REQUEST));
            }
            if (!otp) {
                return next(new ApiError_1.default(strings_1.default.OTP_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (otp.length !== 6) {
                return next(new ApiError_1.default(strings_1.default.INVALID_OTP, statusCodes_1.default.BAD_REQUEST));
            }
            const _email = email?.toLowerCase().trim();
            const _otp = otp?.trim();
            const isEmailExists = await this._userSvc.checkIsEmailExistsExc(_email);
            if (!isEmailExists) {
                return next(new ApiError_1.default(strings_1.default.EMAIL_NOT_REGISTERED, statusCodes_1.default.BAD_REQUEST));
            }
            const otpObj = await Otp_1.default.findOne({ otp: _otp, email: _email });
            if (!otpObj) {
                return next(new ApiError_1.default(strings_1.default.INCORRECT_OTP, statusCodes_1.default.BAD_REQUEST));
            }
            if (await otpObj.isExpired()) {
                return next(new ApiError_1.default(strings_1.default.OTP_EXPIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (await otpObj.isAleadyUsed()) {
                return next(new ApiError_1.default(strings_1.default.OTP_ALREADY_USED, statusCodes_1.default.BAD_REQUEST));
            }
            const currentUser = await this._userSvc.findUserByEmailExc(_email);
            await currentUser.setPassword(password.trim());
            otpObj.isUsed = true;
            await otpObj.save();
            await currentUser.getToken(true);
            res.status(statusCodes_1.default.CREATED);
            return res.json({
                success: true,
                message: strings_1.default.SUCCESS,
            });
        }
        catch (error) {
            const errorMessage = error?.message || error || strings_1.default.SOMETHING_WENT_WRONG;
            logger_1.default.getInstance().error("PasswordController: resetPassword", "errorInfo:" + JSON.stringify(error));
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: errorMessage,
            });
        }
    };
    changePassword = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.POST) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        try {
            const { oldPassword, password, confirmPassword, } = req.body;
            if (!oldPassword) {
                return next(new ApiError_1.default(strings_1.default.OLD_PASSWORD_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (oldPassword.length < 8) {
                return next(new ApiError_1.default(strings_1.default.OLD_PASSWORD_MIN_LENGTH_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            if (oldPassword.length > 32) {
                return next(new ApiError_1.default(strings_1.default.OLD_PASSWORD_MAX_LENGTH_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            if (!password) {
                return next(new ApiError_1.default(strings_1.default.PASSWORD_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (password.length < 8) {
                return next(new ApiError_1.default(strings_1.default.PASSWORD_MIN_LENGTH_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            if (password.length > 32) {
                return next(new ApiError_1.default(strings_1.default.PASSWORD_MAX_LENGTH_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            if (!confirmPassword) {
                return next(new ApiError_1.default(strings_1.default.CONFIRM_PASSWORD_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (confirmPassword.length < 8) {
                return next(new ApiError_1.default(strings_1.default.CONFIRM_PASSWORD_MIN_LENGTH_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            if (confirmPassword.length > 32) {
                return next(new ApiError_1.default(strings_1.default.CONFIRM_PASSWORD_MAX_LENGTH_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            if (password.trim() !== confirmPassword.trim()) {
                return next(new ApiError_1.default(strings_1.default.PASSWORDS_DO_NOT_MATCH, statusCodes_1.default.BAD_REQUEST));
            }
            const currentUser = req.currentUser;
            if (!currentUser) {
                return next(new ApiError_1.default(strings_1.default.USER_NOT_FOUND, statusCodes_1.default.NOT_FOUND));
            }
            const isPasswordMatched = await currentUser.matchPassword(oldPassword);
            if (!isPasswordMatched) {
                return next(new ApiError_1.default(strings_1.default.INCORRECT_OLD_PASSWORD, statusCodes_1.default.BAD_REQUEST));
            }
            await currentUser.setPassword(password.trim());
            await currentUser.getToken(true);
            res.status(statusCodes_1.default.CREATED);
            return res.json({
                success: true,
                message: strings_1.default.SUCCESS,
            });
        }
        catch (error) {
            const errorMessage = error?.message || error || strings_1.default.SOMETHING_WENT_WRONG;
            logger_1.default.getInstance().error("PasswordController: changePassword", "errorInfo:" + JSON.stringify(error));
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: errorMessage,
            });
        }
    };
}
exports.default = PasswordController;
//# sourceMappingURL=password.js.map