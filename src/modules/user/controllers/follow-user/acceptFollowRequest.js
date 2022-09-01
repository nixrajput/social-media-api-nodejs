import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import ResponseMessages from "../../../../contants/responseMessages.js";

/// FOLLOW USER ///

const acceptFollowRequest = catchAsyncError(async (req, res, next) => {

    if (!req.query.id || !req.query.action) {
        return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
    }

    const followRequest = await models.Notification.findOne({
        _id: req.query.id,
        type: "followRequest",
    });

    if (!followRequest) {
        return next(new ErrorHandler("follow request not found", 404));
    }

    if (req.query.action === "remove") {
        await followRequest.remove();
        res.status(200).json({
            success: true,
            message: "follow request removed",
        });
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
    userRequested.followingsCount++;

    await models.Notification.create({
        owner: userRequested._id,
        user: user._id,
        body: "accepted your follow request",
        type: "followRequestAccepted",
    });

    await followRequest.remove();
    await user.save();
    await userRequested.save();

    res.status(200).json({
        success: true,
        message: "follow request accepted",
    });
});

export default acceptFollowRequest;
