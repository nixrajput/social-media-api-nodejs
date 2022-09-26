import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// SAVE DEVICE ID ///

const saveDeviceId = catchAsyncError(async (req, res, next) => {
    const { deviceId } = req.body;

    if (!deviceId) {
        return next(new ErrorHandler(ResponseMessages.INVALID_REQUEST, 400));
    }

    const user = await models.User.findById(req.user._id).select("_id deviceId");

    if (!user) {
        return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
    }

    user.deviceId = deviceId;

    await user.save();

    res.status(200).json({
        success: true,
        message: ResponseMessages.DEVICE_ID_SAVED,
    });
});

export default saveDeviceId;
