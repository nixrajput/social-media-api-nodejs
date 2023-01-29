import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import dateUtility from "../../../../utils/dateUtil.js";
import utility from "../../../../utils/utility.js";

/// @route  POST /api/v1/reset-password

const resetPassword = catchAsyncError(async (req, res, next) => {
  const { otp, newPassword, confirmPassword } = req.body;

  if (!otp) {
    return next(new ErrorHandler(ResponseMessages.OTP_REQUIRED, 400));
  }

  if (otp.length !== 6) {
    return next(new ErrorHandler(ResponseMessages.INVALID_OTP, 400));
  }

  if (!newPassword) {
    return next(new ErrorHandler(ResponseMessages.NEW_PASSWORD_REQUIRED, 400));
  }

  if (!confirmPassword) {
    return next(new ErrorHandler(ResponseMessages.CONFIRM_PASSWORD_REQUIRED, 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler(ResponseMessages.PASSWORDS_DO_NOT_MATCH, 400));
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

  const user = await models.User.findOne({ _id: otpObj.user });

  if (!user) {
    return next(new ErrorHandler(ResponseMessages.INCORRECT_OTP, 400));
  }

  if (user.accountStatus !== "active" && user.accountStatus !== "deactivated") {
    return res.status(401).json({
      success: false,
      accountStatus: user.accountStatus,
      message: ResponseMessages.ACCOUNT_NOT_ACTIVE,
    });
  }

  user.password = newPassword;
  user.passwordChangedAt = Date.now();
  await user.save();

  otpObj.remove();

  await utility.generateAuthToken(user);

  res.status(200).json({
    success: true,
    message: ResponseMessages.PASSWORD_RESET_SUCCESS,
  });
});

export default resetPassword;
