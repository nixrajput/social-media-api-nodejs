import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// ADD NEW COMMENT ///

const addComment = catchAsyncError(async (req, res, next) => {
  if (!req.query.postId) {
    return next(new ErrorHandler("please enter post id in query params", 400));
  }

  const { comment } = req.body;

  if (!comment) {
    return next(new ErrorHandler("comment is required", 400));
  }

  const post = await models.Post.findById(req.query.postId);

  if (!post) {
    return next(new ErrorHandler("post not found", 404));
  }

  const newComment = await models.Comment.create({
    comment: comment,
    user: req.user._id,
    post: post._id,
  });

  post.comments.push(newComment._id);

  if (post.owner.toString() !== req.user._id.toString()) {
    await models.Notification.create({
      owner: post.owner,
      user: req.user._id,
      body: "commented on your post.",
      refId: post._id,
      type: "post",
    });
  }

  await post.save();

  res.status(200).json({
    success: true,
    message: "comment added successfully",
  });
});

export default addComment;
