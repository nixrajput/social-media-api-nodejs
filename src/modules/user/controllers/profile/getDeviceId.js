import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// GET DEVICE ID ///

const getDeviceId = catchAsyncError(async (req, res, next) => {
    const user = await models.User.findById(req.user._id).select("_id deviceId");

    if (!user) {
        return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
    }

    if (!user.deviceId) {
        return next(new ErrorHandler(ResponseMessages.DEVICE_ID_NOT_FOUND, 404));
    }

    res.status(200).json({
        success: true,
        data: {
            deviceId: user.deviceId,
        },
        message: ResponseMessages.DEVICE_ID_RECEIVED,
    });
});

export default getDeviceId;
