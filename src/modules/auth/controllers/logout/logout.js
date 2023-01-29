import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// @route  GET api/v1/logout

const logout = catchAsyncError(async (req, res, next) => {
  const user = await models.User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
  }

  const authToken = await models.AuthToken.findOne({ user: user._id });

  if (authToken) {
    await authToken.remove();
  }

  res.status(200).json({
    success: true,
    message: ResponseMessages.LOGOUT_SUCCESS,
  });
});

export default logout;
