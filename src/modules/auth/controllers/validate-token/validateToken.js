import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// @route  GET api/v1/validate-token

const validateToken = catchAsyncError(async (req, res, next) => {
    const { token } = req.query;

    if (!token) {
        return next(new ErrorHandler(ResponseMessages.TOKEN_REQUIRED));
    }

    const authToken = await models.AuthToken.findOne({
        token: token,
        user: req.user._id,
    });

    if (!authToken) {
        return next(new ErrorHandler(ResponseMessages.INVALID_TOKEN, 400));
    }

    if (authToken.expiresAt < new Date().getTime() / 1000) {
        return next(new ErrorHandler(ResponseMessages.EXPIRED_TOKEN, 400));
    }

    res.status(200).json({
        success: true,
        message: ResponseMessages.VALID_TOKEN,
    });
});

export default validateToken;
