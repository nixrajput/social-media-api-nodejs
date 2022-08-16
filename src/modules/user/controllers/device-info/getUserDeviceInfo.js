import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// GET USER DEVICE INFO ///

const getUserDeviceInfo = catchAsyncError(async (req, res, next) => {
  const user = await models.User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  const loginDetails = await models.DeviceInfo.find(
    { user: user._id },
    { __v: 0 }
  );

  res.status(200).json({
    success: true,
    count: loginDetails.length,
    results: loginDetails,
  });
});

export default getUserDeviceInfo;
