import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// FOLLOW USER ///

const followUser = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(
      new ErrorHandler(
        "please enter user id of user to follow in query params",
        400
      )
    );
  }
  const userToFollow = await models.User.findById(req.query.id);
  const user = await models.User.findById(req.user._id);

  if (!userToFollow) {
    return next(new ErrorHandler("user not found", 404));
  }

  if (user.following.includes(userToFollow._id)) {
    const indexFollowing = user.following.indexOf(userToFollow._id);
    user.following.splice(indexFollowing, 1);

    const indexFollower = userToFollow.followers.indexOf(user._id);
    userToFollow.followers.splice(indexFollower, 1);

    await user.save();
    await userToFollow.save();

    res.status(200).json({
      success: true,
      message: "user unfollowed",
    });
  } else {
    user.following.push(userToFollow._id);
    userToFollow.followers.push(user._id);

    await user.save();
    await userToFollow.save();

    res.status(200).json({
      success: true,
      message: "user followed",
    });
  }
});

export default followUser;
