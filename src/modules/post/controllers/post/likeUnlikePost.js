import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// LIKE/UNLIKE POST ///

const likeUnlikePost = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler("please enter post id in query params", 400));
  }

  const post = await models.Post.findById(req.query.id)
    .select([
      "_id", "owner", "likesCount", "likes",
    ]);

  if (!post) {
    return next(new ErrorHandler("post not found", 404));
  }

  const isLiked = await utility.checkIfPostLiked(post._id, req.user);

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

    const isPostOwner = await utility.checkIfPostOwner(post._id, req.user);

    if (!notification && !isPostOwner) {
      await models.Notification.create({
        owner: post.owner,
        user: req.user._id,
        body: "liked your post",
        refId: post._id,
        type: "like",
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
