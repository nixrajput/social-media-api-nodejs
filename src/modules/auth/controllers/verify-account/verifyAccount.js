import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import dates from "../../../../utils/dateFunc.js";
import validators from "../../../../utils/validators.js";

/// VERIFY ACCOUNT ///

const verifyAccount = catchAsyncError(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!otp) {
        return next(new ErrorHandler(ResponseMessages.OTP_REQUIRED, 400));
    }

    if (otp.length !== 6) {
        return next(new ErrorHandler(ResponseMessages.INVALID_OTP, 400));
    }

    if (!email) {
        return next(new ErrorHandler(ResponseMessages.EMAIL_REQUIRED, 400));
    }

    if (email && !validators.validateEmail(email)) {
        return next(new ErrorHandler(ResponseMessages.INVALID_EMAIL, 400));
    }

    const otpObj = await models.OTP.findOne({ otp });

    if (!otpObj) {
        return next(new ErrorHandler(ResponseMessages.INCORRECT_OTP, 400));
    }

    if (otpObj.isUsed === true) {
        return next(new ErrorHandler(ResponseMessages.OTP_ALREADY_USED, 400));
    }

    if (dates.compare(otpObj.expiresAt, new Date()) !== 1) {
        return next(new ErrorHandler(ResponseMessages.OTP_EXPIRED, 400));
    }

    const user = await models.User.findOne({ email: email });

    if (!user) {
        return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
    }

    if (otpObj.user.toString() === user._id.toString()) {
        if (user.isValid === false) {
            user.isValid = true;
            user.emailVerified = true;
            otpObj.isUsed = true;

            await otpObj.save();
            await user.save();

            res.status(200).json({
                success: true,
                message: ResponseMessages.ACCOUNT_VERIFY_SUCCESS,
            });
        }

        otpObj.isUsed = true;

        await otpObj.save();

        res.status(200).json({
            success: true,
            message: ResponseMessages.ACCOUNT_ALREADY_VERIFIED,
        });
    } else {
        return next(new ErrorHandler(ResponseMessages.INCORRECT_OTP, 400));
    }
});

export default verifyAccount;
