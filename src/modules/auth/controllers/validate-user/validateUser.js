import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import validators from "../../../../utils/validators.js";
import dateUtility from "../../../../utils/dateUtil.js";
import ResponseMessages from "../../../../contants/responseMessages.js";

/// @route  POST api/v1/validate-user

const validateUser = catchAsyncError(async (req, res, next) => {
    const { email, phone, otp } = req.body;

    if (!email && !phone) {
        return next(new ErrorHandler(ResponseMessages.EMAIL_OR_PHONE_REQUIRED, 400));
    }

    if (email) {
        if (!validators.validateEmail(email)) {
            return next(new ErrorHandler(ResponseMessages.INVALID_EMAIL, 400));
        }
    }

    if (phone) {
        if (!validators.validatePhone(phone)) {
            return next(new ErrorHandler(ResponseMessages.INVALID_PHONE, 400));
        }
    }

    if (!otp) {
        return next(new ErrorHandler(ResponseMessages.OTP_REQUIRED, 400));
    }

    if (otp.length !== 6) {
        return next(new ErrorHandler(ResponseMessages.INVALID_OTP, 400));
    }

    const otpObj = await models.OTP.findOne({ otp });

    if (!otpObj) {
        return next(new ErrorHandler(ResponseMessages.INCORRECT_OTP, 400));
    }

    if (otpObj.isUsed === true) {
        return next(new ErrorHandler(ResponseMessages.OTP_ALREADY_USED, 400));
    }

    if (dateUtility.compare(otpObj.expiresAt, new Date()) !== 1) {
        return next(new ErrorHandler(ResponseMessages.OTP_EXPIRED, 400));
    }

    if (otpObj.email !== email || otpObj.phone !== phone) {
        return next(new ErrorHandler(ResponseMessages.INCORRECT_OTP, 400));
    }

    let user = null;

    if (email) {
        user = await models.User.findOne({ email });
    }

    if (phone) {
        user = await models.User.findOne({ phone });
    }

    if (!user) {
        return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 400));
    }

    if (user.isValid === true) {
        otpObj.isUsed = true;
        await otpObj.save();
        return next(new ErrorHandler(ResponseMessages.ACCOUNT_ALREADY_VALIDATED, 400));
    }

    user.isValid = true;

    if (email) {
        user.emailVerified = true;
    }

    if (phone) {
        user.phoneVerified = true;
    }

    await user.save();

    otpObj.isUsed = true;
    await otpObj.save();

    res.status(200).json({
        success: true,
        message: ResponseMessages.ACCOUNT_VALIDATED,
    });

});

export default validateUser;