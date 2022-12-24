import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import dateUtility from "../../../../utils/dateUtil.js";
import validators from "../../../../utils/validators.js";

/// ADD/CHANGE EMAIL ///

const addChangePhone = catchAsyncError(async (req, res, next) => {
    const { otp, phone, countryCode } = req.body;

    if (!otp) {
        return next(new ErrorHandler(ResponseMessages.OTP_REQUIRED, 400));
    }

    if (otp.length !== 6) {
        return next(new ErrorHandler(ResponseMessages.INVALID_OTP, 400));
    }

    if (!phone) {
        return next(new ErrorHandler(ResponseMessages.PHONE_REQUIRED, 400));
    }

    if (!countryCode) {
        return next(new ErrorHandler(ResponseMessages.COUNTRY_CODE_REQUIRED, 400));
    }

    if ((phone && countryCode) && !validators.validatePhone(countryCode + phone)) {
        return next(new ErrorHandler(ResponseMessages.INVALID_PHONE, 400));
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

    const user = await models.User.findById(req.user._id);

    if (!user) {
        return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
    }

    if (otpObj.user.toString() === user._id.toString()) {
        if (user.phone === phone) {
            return next(new ErrorHandler(ResponseMessages.PHONE_ALREADY_EXISTS, 400));
        }

        user.phone = phone;
        user.countryCode = countryCode;
        user.phoneVerified = true;
        user.phoneChangedAt = Date.now();

        otpObj.isUsed = true;

        await otpObj.save();
        await user.save();

        res.status(200).json({
            success: true,
            message: ResponseMessages.PHONE_CHANGE_SUCCESS,
        });

    } else {
        return next(new ErrorHandler(ResponseMessages.INCORRECT_OTP, 400));
    }

});

export default addChangePhone;
