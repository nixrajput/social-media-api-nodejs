"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const strings_1 = __importDefault(require("../../constants/strings"));
const ApiError_1 = __importDefault(require("../../exceptions/ApiError"));
const MailServiceHelper_1 = __importDefault(require("../../helpers/MailServiceHelper"));
const MailTemplateHelper_1 = __importDefault(require("../../helpers/MailTemplateHelper"));
const OtpServiceHelper_1 = __importDefault(require("../../helpers/OtpServiceHelper"));
const logger_1 = __importDefault(require("../../logger"));
const Otp_1 = __importDefault(require("../../models/Otp"));
const validator_1 = __importDefault(require("../../utils/validator"));
const enums_1 = require("../../enums");
class RegisterController {
    userSvc;
    profileSvc;
    _userSvc;
    _profileSvc;
    constructor(userSvc, profileSvc) {
        this.userSvc = userSvc;
        this.profileSvc = profileSvc;
        this._userSvc = userSvc;
        this._profileSvc = profileSvc;
    }
    sendRegisterOtp = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.POST) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        try {
            const { fname, lname, email, username, password, confirmPassword, } = req.body;
            if (!fname) {
                return next(new ApiError_1.default(strings_1.default.FIRST_NAME_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (!lname) {
                return next(new ApiError_1.default(strings_1.default.LAST_NAME_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (!email) {
                return next(new ApiError_1.default(strings_1.default.EMAIL_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (!validator_1.default.validateEmail(email)) {
                return next(new ApiError_1.default(strings_1.default.INVALID_EMAIL_FORMAT, statusCodes_1.default.BAD_REQUEST));
            }
            if (!username) {
                return next(new ApiError_1.default(strings_1.default.USERNAME_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (!validator_1.default.validateUsername(username)) {
                return next(new ApiError_1.default(strings_1.default.INVALID_USERNAME_FORMAT, statusCodes_1.default.BAD_REQUEST));
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
            const _fname = fname?.trim();
            const _lname = lname?.trim();
            const _email = email?.toLowerCase().trim();
            const _username = username?.trim();
            const isEmailExists = await this._userSvc.checkIsEmailExistsExc(_email);
            if (isEmailExists) {
                res.status(statusCodes_1.default.BAD_REQUEST);
                return res.json({
                    success: false,
                    message: strings_1.default.EMAIL_ALREADY_REGISTERED,
                    isEmailUsed: true,
                });
            }
            const isUsernameExists = await this._userSvc.checkIsUsernameExistsExc(_username);
            if (isUsernameExists) {
                res.status(statusCodes_1.default.BAD_REQUEST);
                return res.json({
                    success: false,
                    message: strings_1.default.USERNAME_ALREADY_REGISTERED,
                    isUsernameUsed: true,
                });
            }
            const newOtp = await OtpServiceHelper_1.default.generateOtpFromEmail(_email);
            if (!newOtp) {
                return next(new ApiError_1.default(strings_1.default.OTP_CREATE_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            const htmlMessage = await MailTemplateHelper_1.default.getOtpEmail(newOtp.otp, `${_fname} ${_lname}`);
            if (htmlMessage) {
                await MailServiceHelper_1.default.sendEmail({
                    to: _email,
                    subject: "OTP For Registration",
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
            logger_1.default.getInstance().error("RegisterController: sendRegisterOtp", "errorInfo:" + JSON.stringify(error));
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: errorMessage,
            });
        }
    };
    register = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.POST) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        try {
            const { fname, lname, email, username, password, confirmPassword, otp, } = req.body;
            if (!fname) {
                return next(new ApiError_1.default(strings_1.default.FIRST_NAME_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (!lname) {
                return next(new ApiError_1.default(strings_1.default.LAST_NAME_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (!email) {
                return next(new ApiError_1.default(strings_1.default.EMAIL_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (!validator_1.default.validateEmail(email)) {
                return next(new ApiError_1.default(strings_1.default.INVALID_EMAIL_FORMAT, statusCodes_1.default.BAD_REQUEST));
            }
            if (!username) {
                return next(new ApiError_1.default(strings_1.default.USERNAME_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (!validator_1.default.validateUsername(username)) {
                return next(new ApiError_1.default(strings_1.default.INVALID_USERNAME_FORMAT, statusCodes_1.default.BAD_REQUEST));
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
            const _fname = fname?.trim();
            const _lname = lname?.trim();
            const _email = email?.toLowerCase().trim();
            const _username = username?.trim();
            const _otp = otp?.trim();
            const isEmailExists = await this._userSvc.checkIsEmailExistsExc(_email);
            if (isEmailExists) {
                res.status(statusCodes_1.default.BAD_REQUEST);
                return res.json({
                    success: false,
                    message: strings_1.default.EMAIL_ALREADY_REGISTERED,
                    isEmailUsed: true,
                });
            }
            const isUsernameExists = await this._userSvc.checkIsUsernameExistsExc(_username);
            if (isUsernameExists) {
                res.status(statusCodes_1.default.BAD_REQUEST);
                return res.json({
                    success: false,
                    message: strings_1.default.USERNAME_ALREADY_REGISTERED,
                    isUsernameUsed: true,
                });
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
            const _currentDateTime = new Date(Date.now());
            const newUserData = {
                fname: _fname,
                lname: _lname,
                nameChangedAt: _currentDateTime,
                email: _email,
                isEmailVerified: true,
                emailChangedAt: _currentDateTime,
                username: _username,
                usernameChangedAt: _currentDateTime,
            };
            const newUser = await this._userSvc.createUserExc(newUserData);
            await newUser.setPassword(password.trim());
            await this._profileSvc.getProfileExc(newUser);
            otpObj.isUsed = true;
            await otpObj.save();
            const authToken = await newUser.getToken();
            res.status(statusCodes_1.default.CREATED);
            return res.json({
                success: true,
                message: strings_1.default.SUCCESS,
                data: {
                    token: authToken.token,
                    expiresAt: authToken.expiresAt,
                },
            });
        }
        catch (error) {
            const errorMessage = error?.message || error || strings_1.default.SOMETHING_WENT_WRONG;
            logger_1.default.getInstance().error("RegisterController: register", "errorInfo:" + JSON.stringify(error));
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: errorMessage,
            });
        }
    };
}
exports.default = RegisterController;
//# sourceMappingURL=register.js.map