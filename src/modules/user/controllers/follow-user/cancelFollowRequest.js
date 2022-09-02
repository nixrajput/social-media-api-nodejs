import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import ResponseMessages from "../../../../contants/responseMessages.js";

/// CANCEL FOLLOW REQUEST ///

const cancelFollowRequest = catchAsyncError(async (req, res, next) => {

    if (!req.query.id) {
        return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
    }

    const userToFollow = await models.User.findById(req.query.id);
    const user = await models.User.findById(req.user._id);

    const isRequested = await models.Notification.findOne({
        owner: userToFollow._id,
        user: user._id,
        type: "followRequest",
    });

    if (!isRequested) {
        return next(new ErrorHandler("follow request not found", 404));
    }

    if (req.user._id.toString() !== isRequested.user.toString()) {
        return next(new ErrorHandler(ResponseMessages.UNAUTHORIZED, 403));
    }

    await isRequested.remove();

    res.status(200).json({
        success: true,
        message: "follow request canceled",
    });
});

export default cancelFollowRequest;
