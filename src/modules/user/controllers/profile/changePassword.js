import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// CHANGE PASSWORD ///

const changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword) {
    return next(new ErrorHandler("please enter old password", 400));
  }

  if (!newPassword) {
    return next(new ErrorHandler("please enter new password", 400));
  }

  if (!confirmPassword) {
    return next(new ErrorHandler("please enter confirm password", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("both passwords do not matched", 400));
  }

  const user = await models.User.findById(req.user._id).select("+password");

  const isPasswordMatched = await user.matchPassword(oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect.", 400));
  }

  user.password = newPassword;

  await user.generateToken();
  await user.save();

  res.status(200).json({
    success: true,
    message: "password has been changed successfully",
  });
});

export default changePassword;
