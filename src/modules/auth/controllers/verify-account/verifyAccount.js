import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import dates from "../../../../utils/dateFunc.js";
import validators from "../../../../utils/validators.js";

/// VERIFY ACCOUNT ///

const verifyAccount = catchAsyncError(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email) {
        return next(new ErrorHandler("email is required", 400));
    }

    if (!validators.validateEmail(email)) {
        return next(new ErrorHandler("email is invalid", 400));
    }

    if (!otp) {
        return next(new ErrorHandler("otp is required", 400));
    }

    if (otp.length !== 6) {
        return next(new ErrorHandler("otp is invalid", 400));
    }

    const otpObj = await models.OTP.findOne({ otp });

    if (!otpObj) {
        return next(new ErrorHandler("otp is incorrect or invalid", 401));
    }

    if (otpObj.isVerified === true) {
        return next(new ErrorHandler("otp is already used", 401));
    }

    if (dates.compare(otpObj.expiresAt, new Date()) === 1) {
        const user = await models.User.findOne({ email: email });

        if (!user) {
            return next(new ErrorHandler("user not found", 404));
        }

        if (otpObj._id.toString() === user.otp.toString()) {
            if (user.isValid === false) {
                user.isValid = true;
                user.emailVerified = true;
                user.otp = undefined;
                otpObj.isVerified = true;

                await otpObj.save();
                await user.save();

                res.status(200).json({
                    success: true,
                    message: "account verified",
                });
            }

            user.otp = undefined;
            otpObj.isVerified = true;

            await otpObj.save();
            await user.save();

            res.status(200).json({
                success: true,
                message: "already verified",
            });
        } else {
            return next(new ErrorHandler("otp is invalid or expired", 401));
        }
    } else {
        return next(new ErrorHandler("otp is expired", 401));
    }
});

export default verifyAccount;
