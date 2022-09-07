import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// VALIDATE TOKEN ///

const validateToken = catchAsyncError(async (req, res, next) => {
    const token = req.query.token;

    if (!token) {
        return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
    }

    const user = await models.User.findById(req.user._id);

    if (!user) {
        return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
    }

    if (user.token !== token) {
        return next(new ErrorHandler(ResponseMessages.INVALID_TOKEN, 400));
    }

    res.status(200).json({
        success: true,
        message: ResponseMessages.VALID_TOKEN,
    });
});

export default validateToken;
