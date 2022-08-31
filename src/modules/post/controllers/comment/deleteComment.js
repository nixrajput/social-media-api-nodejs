import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// DELETE COMMENT ///

const deleteComment = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(
      new ErrorHandler("please enter comment id in query params", 400)
    );
  }

  const comment = await models.Comment.findById(req.query.id);

  if (!comment) {
    return next(new ErrorHandler("comment not found", 404));
  }

  const post = await models.Post.findById(comment.post);

  if (!post) {
    return next(new ErrorHandler("post not found", 404));
  }

  if (
    post.owner.toString() === req.user._id.toString() ||
    comment.user.toString() === req.user._id.toString()
  ) {
    await comment.remove();

    const commentIndex = post.comments.indexOf(comment._id);

    post.comments.splice(commentIndex, 1);
    post.commentsCount--;

    await post.save();

    return res.status(200).json({
      success: true,
      message: "comment deleted successfully",
    });
  } else {
    return next(new ErrorHandler("unauthorized operation", 401));
  }
});

export default deleteComment;
