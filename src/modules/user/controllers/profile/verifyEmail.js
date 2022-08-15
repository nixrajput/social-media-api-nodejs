import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import dates from "../../../../utils/dateFunc.js";

/// VERIFY EMAIL ///

const verifyEmail = catchAsyncError(async (req, res, next) => {
  const { otp } = req.body;

  if (!otp) {
    return next(new ErrorHandler("please enter the otp", 400));
  }

  const otpObj = await models.OTP.findOne({ otp });

  if (!otpObj) {
    return next(new ErrorHandler("otp is invalid", 401));
  }

  if (otpObj.isVerified === true) {
    return next(new ErrorHandler("otp is already used", 401));
  }

  if (dates.compare(otpObj.expiresAt, new Date()) === 1) {
    const user = await models.User.findById(req.user._id);

    if (!user) {
      return next(new ErrorHandler("user not found", 404));
    }

    if (otpObj._id.toString() === user.otp.toString()) {
      if (user.emailVerified === false) {
        user.emailVerified = true;
        user.otp = undefined;
        otpObj.isVerified = true;

        await otpObj.save();
        await user.save();

        res.status(200).json({
          success: true,
          message: "email verified",
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

export default verifyEmail;
