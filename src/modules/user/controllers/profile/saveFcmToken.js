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

    const userToken = await models.FcmToken.findOne({ user: req.user._id });

    if (userToken && userToken.token === fcmToken) {
        return res.status(200).json({
            success: true,
            token: userToken.token,
            message: ResponseMessages.FCM_TOKEN_ALREADY_EXISTS,
        });
    }

    if (userToken) {
        userToken.token = fcmToken;
        await userToken.save();
    } else {
        await models.FcmToken.create({
            user: req.user._id,
            token: fcmToken,
        });
    }

    res.status(200).json({
        success: true,
        token: fcmToken,
        message: ResponseMessages.FCM_TOKEN_SAVED,
    });
});

export default saveFcmToken;
