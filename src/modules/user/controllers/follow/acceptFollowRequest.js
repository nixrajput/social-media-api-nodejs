import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import ResponseMessages from "../../../../contants/responseMessages.js";

/// ACCEPT/REMOVE FOLLOW REQUEST ///

const acceptFollowRequest = catchAsyncError(async (req, res, next) => {
    if (!req.query.id) {
        return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
    }

    const followRequest = await models.FollowRequest.findById(req.query.id);

    if (!followRequest) {
        return next(new ErrorHandler(ResponseMessages.FOLLOW_REQUEST_NOT_FOUND, 404));
    }

    const user = await models.User.findById(req.user._id)
        .select("_id followersCount followingCount isPrivate");

    const userRequested = await models.User.findById(followRequest.from)
        .select("_id followersCount followingCount isPrivate");

    if (followRequest.to.toString() !== user._id.toString()) {
        return next(new ErrorHandler(ResponseMessages.UNAUTHORIZED, 404));
    }

    await models.Follower.create({
        user: user._id,
        follower: userRequested._id,
    });

    user.followersCount += 1;
    userRequested.followingCount += 1;

    await user.save();
    await userRequested.save();

    await models.FollowRequest.findByIdAndDelete(followRequest._id);

    const sentToReqUserNotification = await models.Notification.findOne({
        to: userRequested._id,
        from: user._id,
        type: "followRequestAccepted",
    });

    if (sentToReqUserNotification) {
        sentToReqUserNotification.isRead = false;
        await sentToReqUserNotification.save();
    }
    else {
        await models.Notification.create({
            to: userRequested._id,
            from: user._id,
            body: "accepted your follow request",
            type: "followRequestAccepted",
        });
    }

    const sentToUserNotification = await models.Notification.findOne({
        to: user._id,
        from: userRequested._id,
        type: "followRequest",
    });

    if (sentToUserNotification) {
        sentToUserNotification.isRead = false;
        sentToUserNotification.type = "followRequestApproved";
        sentToUserNotification.body = "started following you";
        await sentToUserNotification.save();
    }
    else {
        await models.Notification.create({
            to: user._id,
            from: userRequested._id,
            body: "started following you",
            type: "followRequestApproved",
        });
    }

    res.status(200).json({
        success: true,
        message: ResponseMessages.FOLLOW_REQUEST_ACCEPTED,
    });
});

export default acceptFollowRequest;
