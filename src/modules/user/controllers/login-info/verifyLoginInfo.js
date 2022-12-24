import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import ResponseMessages from "../../../../contants/responseMessages.js";
import models from "../../../../models/index.js";

const verifyLoginInfo = catchAsyncError(async (req, res, next) => {
    const { deviceId } = req.query;

    if (!deviceId) {
        return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
    }

    const loginInfo = await models.LoginInfo.findOne({
        user: req.user._id,
        deviceId: deviceId,
    });

    if (!loginInfo) {
        return res.status(400).json({
            success: false,
            isValid: false,
            message: ResponseMessages.INVALID_LOGIN_INFO,
        });
    }

    res.status(200).json({
        success: true,
        isValid: true,
        message: ResponseMessages.LOGIN_INFO_VALIDATED,
    });
});

export default verifyLoginInfo;

