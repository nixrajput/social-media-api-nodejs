import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import validators from "../../../../utils/validators.js";
import utility from "../../../../utils/utility.js";

/// CHANGE USERNAME ///

const changeUsername = catchAsyncError(async (req, res, next) => {
  const { uname } = req.body;

  if (!uname) {
    return next(new ErrorHandler("please enter an username", 400));
  }

  if (uname && !validators.validateUsername(uname)) {
    return next(new ErrorHandler("please enter a valid username", 400));
  }

  const isUsernameAvailable = await utility.checkUsernameAvailable(uname);

  if (isUsernameAvailable) {
    const user = await models.User.findById(req.user._id);

    if (uname) {
      user.uname = uname.toLowerCase();
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "username changed successfully",
    });
  } else {
    res.status(400).json({
      success: false,
      message: "username not available",
    });
  }
});

export default changeUsername;
