import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// DELETE DEVICE INFO ///

const deleteDeviceInfo = catchAsyncError(async (req, res, next) => {
  if (!req.query.deviceId) {
    return next(
      new ErrorHandler("please enter device id in query params", 400)
    );
  }

  const user = await models.User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  let loginDetails;

  loginDetails = await models.DeviceInfo.findOne({
    user: user._id,
    deviceId: req.query.deviceId,
  });

  if (!loginDetails) {
    return next(new ErrorHandler("device not found", 404));
  }

  await loginDetails.remove();

  res.status(200).json({
    success: true,
    message: "device info removed successfully",
  });
});

export default deleteDeviceInfo;
