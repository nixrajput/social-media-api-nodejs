import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import dates from "../../../../utils/dateFunc.js";
import utility from "../../../../utils/utility.js";

/// RESET PASSWORD ///

const resetPassword = catchAsyncError(async (req, res, next) => {
  const { otp, newPassword, confirmPassword } = req.body;

  if (!otp) {
    return next(new ErrorHandler("otp is required", 400));
  }

  if (!newPassword) {
    return next(new ErrorHandler("new password is required", 400));
  }

  if (!confirmPassword) {
    return next(new ErrorHandler("confirm password is required", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("both Passwords do not matched", 400));
  }

  const otpObj = await models.OTP.findOne({ otp });

  if (!otpObj) {
    return next(new ErrorHandler("otp is invalid", 400));
  }

  if (otpObj.isVerified === true) {
    return next(new ErrorHandler("otp is already used", 400));
  }

  if (dates.compare(otpObj.expiresAt, new Date()) === 1) {
    const user = await models.User.findOne({
      otp: otpObj._id,
    });

    if (!user) {
      return next(new ErrorHandler("otp is invalid or expired", 400));
    }

    const message = await utility.checkUserAccountStatus(user.accountStatus);

    if (message) {
      return next(new ErrorHandler(message, 400));
    }

    user.password = newPassword;
    user.otp = undefined;
    otpObj.isVerified = true;

    await user.generateToken();
    await otpObj.save();
    await user.save();

    res.status(200).json({
      success: true,
      message: "password has been reset successfully",
    });
  } else {
    return next(new ErrorHandler("otp is expired", 400));
  }
});

export default resetPassword;
