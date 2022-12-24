import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import validators from "../../../../utils/validators.js";
import dateUtility from "../../../../utils/dateUtil.js";
import ResponseMessages from "../../../../contants/responseMessages.js";

/// VERIFY EMAIL OTP ///

const verifyEmailOtp = catchAsyncError(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email) {
        return next(new ErrorHandler(ResponseMessages.EMAIL_REQUIRED, 400));
    }

    if (!validators.validateEmail(email)) {
        return next(new ErrorHandler(ResponseMessages.INVALID_EMAIL, 400));
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

    if (otpObj.email !== email) {
        return next(new ErrorHandler(ResponseMessages.INCORRECT_OTP, 400));
    }

    otpObj.isUsed = true;
    await otpObj.save();

    res.status(200).json({
        success: true,
        message: ResponseMessages.OTP_VERIFY_SUCCESS,
    });

});

export default verifyEmailOtp;