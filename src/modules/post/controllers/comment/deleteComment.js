import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// DELETE COMMENT ///

const deleteComment = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(
      new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400)
    );
  }

  const comment = await models.Comment.findById(req.query.id);

  if (!comment) {
    return next(new ErrorHandler(ResponseMessages.COMMENT_NOT_FOUND, 404));
  }

  const post = await models.Post.findById(comment.post)
    .select("_id owner commentsCount");

  if (!post) {
    return next(new ErrorHandler(ResponseMessages.POST_NOT_FOUND, 404));
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler(ResponseMessages.UNAUTHORIZED, 401));
  }

  await comment.remove();
  post.commentsCount--;

  await post.save();

  return res.status(200).json({
    success: true,
    message: ResponseMessages.COMMENT_DELETE_SUCCESS,
  });
});

export default deleteComment;
