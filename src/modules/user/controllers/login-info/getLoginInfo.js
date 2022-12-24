import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// GET LOGIN INFO ///

const getLoginInfo = catchAsyncError(async (req, res, next) => {
    const deviceId = req.query.deviceId;
    const ip = req.query.ip;

    if (!deviceId) {
        return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
    }

    const loginInfo = await models.LoginInfo.findOne({
        user: req.user._id,
        deviceId,
        ip,
    });

    if (!loginInfo) {
        return next(new ErrorHandler(ResponseMessages.LOGIN_INFO_NOT_FOUND, 404));
    }

    res.status(200).json({
        success: true,
        message: ResponseMessages.LOGIN_INFO_FOUND,
        data: loginInfo,
    });
});

export default getLoginInfo;
