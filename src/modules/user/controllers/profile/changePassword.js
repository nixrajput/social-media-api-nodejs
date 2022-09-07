import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// CHANGE PASSWORD ///

const changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword) {
    return next(new ErrorHandler(ResponseMessages.OLD_PASSWORD_REQUIRED, 400));
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

  const user = await models.User.findById(req.user._id).select("password");

  const isPasswordMatched = await user.matchPassword(oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler(ResponseMessages.INCORRECT_CURRENT_PASSWORD, 400));
  }

  user.password = newPassword;

  await user.generateToken();
  await user.save();

  res.status(200).json({
    success: true,
    message: ResponseMessages.PASSWORD_CHANGE_SUCCESS,
  });
});

export default changePassword;
