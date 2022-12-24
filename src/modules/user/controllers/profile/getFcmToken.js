import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// GET FCM TOKEN ///

const getFcmToken = catchAsyncError(async (req, res, next) => {
    const userId = req.query.id || req.user._id;

    if (!userId) {
        return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
    }

    const userToken = await models.FcmToken.findOne({ user: userId });

    if (!userToken) {
        return next(new ErrorHandler(ResponseMessages.FCM_TOKEN_NOT_FOUND, 404));
    }

    res.status(200).json({
        success: true,
        data: {
            token: userToken.token,
        },
        message: ResponseMessages.FCM_TOKEN_RECEIVED,
    });
});

export default getFcmToken;
