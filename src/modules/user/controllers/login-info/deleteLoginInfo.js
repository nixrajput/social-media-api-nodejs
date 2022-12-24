import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// DELETE LOGIN INFO ///

const deleteLoginInfo = catchAsyncError(async (req, res, next) => {
    const deviceId = req.query.deviceId;

    if (!deviceId) {
        return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
    }

    const loginInfo = await models.LoginInfo.findOne({
        user: req.user._id,
        deviceId,
    });

    if (!loginInfo) {
        return next(new ErrorHandler(ResponseMessages.LOGIN_INFO_NOT_FOUND, 404));
    }

    await loginInfo.remove();

    res.status(200).json({
        success: true,
        message: ResponseMessages.LOGIN_INFO_DELETED,
    });
});

export default deleteLoginInfo;
