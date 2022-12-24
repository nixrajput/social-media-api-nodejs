import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import ResponseMessages from "../../../../contants/responseMessages.js";

/// CANCEL FOLLOW REQUEST ///

const cancelFollowRequest = catchAsyncError(async (req, res, next) => {
    if (!req.query.id) {
        return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
    }

    const userToFollow = await models.User.findById(req.query.id)
        .select("_id followersCount followingCount isPrivate");

    const user = await models.User.findById(req.user._id)
        .select("_id followersCount followingCount isPrivate");

    const isRequested = await models.FollowRequest.findOne({
        from: user._id,
        to: userToFollow._id,
    });

    if (!isRequested) {
        return next(new ErrorHandler(ResponseMessages.FOLLOW_REQUEST_NOT_FOUND, 404));
    }

    if (user._id.toString() !== isRequested.from.toString()) {
        return next(new ErrorHandler(ResponseMessages.UNAUTHORIZED, 401));
    }

    await isRequested.remove();

    res.status(200).json({
        success: true,
        message: ResponseMessages.FOLLOW_REQUEST_CANCELLED,
    });
});

export default cancelFollowRequest;
