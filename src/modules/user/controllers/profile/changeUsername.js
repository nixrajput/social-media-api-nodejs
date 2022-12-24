import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import validators from "../../../../utils/validators.js";
import utility from "../../../../utils/utility.js";
import ResponseMessages from "../../../../contants/responseMessages.js";

/// CHANGE USERNAME ///

const changeUsername = catchAsyncError(async (req, res, next) => {
  const { uname } = req.body;

  if (!uname) {
    return next(new ErrorHandler(ResponseMessages.USERAME_REQUIRED, 400));
  }

  if (uname && !validators.validateUsername(uname)) {
    return next(new ErrorHandler(ResponseMessages.INVALID_USERNAME, 400));
  }

  const isUsernameAvailable = await utility.checkUsernameAvailable(uname);

  if (!isUsernameAvailable) {
    return next(new ErrorHandler(ResponseMessages.USERNAME_ALREADY_USED, 400));
  }

  const user = await models.User.findById(req.user._id);

  user.uname = uname.toLowerCase();
  user.usernameChangedAt = Date.now();
  await user.save();

  res.status(200).json({
    success: true,
    message: ResponseMessages.USERNAME_CHANGE_SUCCESS,
  });
});

export default changeUsername;
