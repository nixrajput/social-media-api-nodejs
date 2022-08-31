import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// LIKE/UNLIKE POST ///

const likeUnlikePost = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler("please enter post id in query params", 400));
  }

  const post = await models.Post.findById(req.query.id);

  if (!post) {
    return next(new ErrorHandler("post not found", 404));
  }

  const isLiked = post.likes.find((like) => like.likedBy.toString() === req.user._id.toString());

  if (isLiked) {
    const index = post.likes.indexOf(isLiked);

    post.likes.splice(index, 1);
    post.likesCount--;

    await post.save();

    res.status(200).json({
      success: true,
      message: "post unliked",
    });
  } else {
    post.likes.push({
      likedBy: req.user._id,
    });
    post.likesCount++;

    const notification = await models.Notification.findOne({
      user: req.user._id,
      refId: post._id,
    });

    if (!notification && post.owner.toString() !== req.user._id.toString()) {
      await models.Notification.create({
        owner: post.owner,
        user: req.user._id,
        body: "liked your post.",
        refId: post._id,
        type: "post",
      });
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: "post liked",
    });
  }
});

export default likeUnlikePost;
