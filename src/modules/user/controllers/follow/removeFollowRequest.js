import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import ResponseMessages from "../../../../contants/responseMessages.js";

/// REMOVE FOLLOW REQUEST ///

const removeFollowRequest = catchAsyncError(async (req, res, next) => {
    if (!req.query.id) {
        return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
    }

    const followRequest = await models.FollowRequest.findById(req.query.id);

    if (!followRequest) {
        return next(new ErrorHandler(ResponseMessages.FOLLOW_REQUEST_NOT_FOUND, 404));
    }

    if (req.user._id.toString() !== followRequest.to.toString()) {
        return next(new ErrorHandler(ResponseMessages.UNAUTHORIZED, 401));
    }

    await followRequest.remove();

    res.status(200).json({
        success: true,
        message: ResponseMessages.FOLLOW_REQUEST_REMOVED,
    });
});

export default removeFollowRequest;
