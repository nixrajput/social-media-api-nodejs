import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import validators from "../../../../utils/validators.js";
import utility from "../../../../utils/utility.js";

/// CHECK USERNAME AVAILABLE ///

const checkUsernameAvailable = catchAsyncError(async (req, res, next) => {
  const { uname } = req.body;

  if (!uname) {
    return next(new ErrorHandler("please enter an username", 400));
  }

  if (uname && !validators.validateUsername(uname)) {
    return next(new ErrorHandler("please enter a valid username", 400));
  }

  const isUsernameAvailable = await utility.checkUsernameAvailable(
    uname.toLowerCase()
  );

  if (isUsernameAvailable) {
    res.status(200).json({
      success: true,
      message: "username is available",
    });
  } else {
    res.status(400).json({
      success: false,
      message: "username is not available",
    });
  }
});

export default checkUsernameAvailable;
