import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// SAVE DEVICE INFO ///

const saveDeviceInfo = catchAsyncError(async (req, res, next) => {
  let { deviceId, deviceInfo, locationInfo, lastActive } = req.body;

  if (!deviceId) {
    return next(new ErrorHandler("deviceId is required", 400));
  }

  if (!deviceInfo) {
    return next(new ErrorHandler("deviceInfo is required", 400));
  }

  if (!locationInfo) {
    return next(new ErrorHandler("locationInfo is required", 400));
  }

  if (!lastActive) {
    lastActive = new Date();
  }

  const user = await models.User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  let loginDetails;

  loginDetails = await models.DeviceInfo.findOne({
    user: user._id,
    deviceId: deviceId,
  });

  if (loginDetails) {
    loginDetails.locationInfo = locationInfo;
    loginDetails.lastActive = lastActive;
    await loginDetails.save();
  } else {
    loginDetails = await models.DeviceInfo.create({
      user: user._id,
      deviceId: deviceId,
      deviceInfo: deviceInfo,
      locationInfo: locationInfo,
      lastActive: lastActive,
    });
    user.loggedInDevices.push(loginDetails._id);
    await user.save();
  }

  res.status(200).json({
    success: true,
    message: "device info saved successfully",
  });
});

export default saveDeviceInfo;
