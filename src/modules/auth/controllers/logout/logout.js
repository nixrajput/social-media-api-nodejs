import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// LOGOUT ///

const logout = catchAsyncError(async (req, res, next) => {
  const user = await models.User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  user.token = undefined;
  user.expiresAt = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "logged out successfully",
  });
});

export default logout;
