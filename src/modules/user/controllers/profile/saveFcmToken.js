import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// SAVE FCM TOKEN ///

const saveFcmToken = catchAsyncError(async (req, res, next) => {
    const { fcmToken } = req.body;

    if (!fcmToken) {
        return next(new ErrorHandler(ResponseMessages.INVALID_REQUEST, 400));
    }

    const user = await models.User.findById(req.user._id).select("_id fcmToken");

    if (!user) {
        return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
    }

    user.fcmToken = fcmToken;

    await user.save();

    res.status(200).json({
        success: true,
        message: ResponseMessages.FCM_TOKEN_SAVED,
    });
});

export default saveFcmToken;
