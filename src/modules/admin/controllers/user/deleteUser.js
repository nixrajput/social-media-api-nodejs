import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// DELETE USER ///

const deleteUser = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler("please enter user id in query params", 400));
  }

  const user = await models.User.findById(req.query.id);

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  const posts = user.posts;
  const followers = user.followers;
  const followings = user.following;
  const userId = user._id;

  await user.remove();

  for (let i = 0; i < posts.length; i++) {
    const post = await models.Post.findById(posts[i]);
    post.remove();
  }

  for (let i = 0; i < followers.length; i++) {
    const follower = await models.User.findById(followers[i]);

    const index = follower.following.indexOf(userId);

    follower.following.splice(index, 1);

    await follower.save();
  }

  for (let i = 0; i < followings.length; i++) {
    const following = await models.User.findById(followings[i]);

    const index = following.followers.indexOf(userId);

    following.followers.splice(index, 1);

    await following.save();
  }

  res.status(200).json({
    success: true,
    message: "user deleted successfully",
  });
});

export default deleteUser;
