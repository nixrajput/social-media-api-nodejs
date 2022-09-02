import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import ResponseMessages from "../../../../contants/responseMessages.js";

/// REMOVE FOLLOW REQUEST ///

const removeFollowRequest = catchAsyncError(async (req, res, next) => {

    if (!req.query.id) {
        return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
    }

    const followRequest = await models.Notification.findOne({
        _id: req.query.id,
        type: "followRequest",
    });

    if (!followRequest) {
        return next(new ErrorHandler("follow request not found", 404));
    }

    if (req.user._id.toString() !== followRequest.owner.toString()) {
        return next(new ErrorHandler(ResponseMessages.UNAUTHORIZED, 403));
    }

    await followRequest.remove();
    res.status(200).json({
        success: true,
        message: "follow request removed",
    });
});

export default removeFollowRequest;
