import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import ResponseMessages from "../../../../contants/responseMessages.js";

/// ACCEPT/REMOVE FOLLOW REQUEST ///

const acceptFollowRequest = catchAsyncError(async (req, res, next) => {

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

    const user = await models.User.findById(req.user._id);
    const userRequested = await models.User.findById(followRequest.user);

    user.followers.push({
        user: userRequested._id,
    });
    user.followersCount++;
    userRequested.following.push({
        user: user._id,
    });
    userRequested.followingCount++;

    followRequest.body = `started following you`;
    followRequest.isRead = true;
    followRequest.type = "followRequestAccepted";

    await models.Notification.create({
        owner: userRequested._id,
        user: user._id,
        body: "accepted your follow request",
        type: "followRequestAccepted",
    });

    await followRequest.save();
    await user.save();
    await userRequested.save();

    res.status(200).json({
        success: true,
        message: "follow request accepted",
    });
});

export default acceptFollowRequest;
