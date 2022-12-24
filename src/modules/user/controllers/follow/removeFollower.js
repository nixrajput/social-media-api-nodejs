import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import ResponseMessages from "../../../../contants/responseMessages.js";

/// REMOVE FOLLOWER ///

const removeFollower = catchAsyncError(async (req, res, next) => {
    if (!req.query.id) {
        return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
    }

    if (req.query.id.toString() === req.user._id.toString()) {
        return next(new ErrorHandler(ResponseMessages.CANNOT_FOLLOW_YOURSELF, 400));
    }

    const followerToRemove = await models.User.findById(req.query.id)
        .select("_id followersCount followingCount isPrivate");

    const user = await models.User.findById(req.user._id)
        .select("_id followersCount followingCount isPrivate");

    if (!followerToRemove) {
        return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
    }

    const isFollower = await models.Follower
        .findOne({ user: user._id, follower: followerToRemove._id }).select("_id");

    if (!isFollower) {
        return next(new ErrorHandler(ResponseMessages.USER_IS_NOT_FOLLOWER, 400));
    }

    await models.Follower.findByIdAndDelete(isFollower._id);

    followerToRemove.followingCount -= 1;
    user.followersCount -= 1;

    await followerToRemove.save();
    await user.save();

    res.status(200).json({
        success: true,
        message: ResponseMessages.REMOVED_FOLLOWER,
    });
});

export default removeFollower;
