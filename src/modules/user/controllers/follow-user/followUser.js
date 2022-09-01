import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import ResponseMessages from "../../../../contants/responseMessages.js";

/// FOLLOW USER ///

const followUser = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
  }

  if (req.query.id.toString() === req.user._id.toString()) {
    return next(new ErrorHandler(ResponseMessages.CANNOT_FOLLOW_YOURSELF, 400));
  }

  const userToFollow = await models.User.findById(req.query.id);
  const user = await models.User.findById(req.user._id);

  if (!userToFollow) {
    return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
  }

  const isFollowing = user.following.find(
    (following) => following.user.toString() === userToFollow._id.toString()
  );

  // res.status(200).json({
  //   success: true,
  //   isFollowing: isFollowing ? true : false,
  // });

  if (isFollowing) {
    const indexFollowing = user.following.indexOf(isFollowing);
    user.following.splice(indexFollowing, 1);
    user.followingsCount--;

    const isFollower = userToFollow.followers.find(
      (follower) => follower.user.toString() === user._id.toString()
    );
    const indexFollower = userToFollow.followers.indexOf(isFollower);
    userToFollow.followers.splice(indexFollower, 1);
    userToFollow.followersCount--;

    await user.save();
    await userToFollow.save();

    res.status(200).json({
      success: true,
      message: "unfollowed user",
    });
  } else {
    if (userToFollow.accountPrivacy === "private") {

      const isRequested = await models.Notification.findOne({
        owner: userToFollow._id,
        user: user._id,
        type: "followRequest",
      });

      if (isRequested) {
        return next(new ErrorHandler("follow request already sent", 400));
      }

      await models.Notification.create({
        owner: userToFollow._id,
        user: user._id,
        body: "sent you a follow request",
        type: "followRequest",
      });

      res.status(200).json({
        success: true,
        message: "follow request sent",
      });
    } else {
      user.following.push({
        user: userToFollow._id,
      });
      user.followingsCount++;

      userToFollow.followers.push({
        user: user._id,
      });
      userToFollow.followersCount++;

      await models.Notification.create({
        owner: userToFollow._id,
        user: user._id,
        body: "started following you",
        type: "follow",
      });

      await user.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "user followed",
      });
    }
  }
});

export default followUser;
