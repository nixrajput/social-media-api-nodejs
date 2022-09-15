import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// ADD NEW COMMENT ///

const addComment = catchAsyncError(async (req, res, next) => {
  if (!req.query.postId) {
    return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
  }

  const { comment } = req.body;

  if (!comment) {
    return next(new ErrorHandler(ResponseMessages.COMMENT_REQUIRED, 400));
  }

  const post = await models.Post.findById(req.query.postId)
    .select("_id owner commentsCount");

  if (!post) {
    return next(new ErrorHandler(ResponseMessages.POST_NOT_FOUND, 404));
  }

  const newComment = await models.Comment.create({
    comment: comment,
    user: req.user._id,
    post: post._id,
  });

  post.commentsCount++;

  if (post.owner.toString() !== req.user._id.toString()) {
    await models.Notification.create({
      to: post.owner,
      from: req.user._id,
      body: "commented on your post.",
      refId: post._id,
      type: "postComment",
    });
  }

  await post.save();

  const ownerData = await utility.getOwnerData(newComment.user, req.user);

  const commentData = {};
  commentData._id = newComment._id;
  commentData.comment = newComment.comment;
  commentData.post = newComment.post;
  commentData.user = ownerData;
  commentData.likesCount = newComment.likesCount;
  commentData.commentStatus = newComment.commentStatus;
  commentData.createdAt = newComment.createdAt;

  res.status(200).json({
    success: true,
    message: ResponseMessages.COMMENT_ADD_SUCCESS,
    comment: commentData,
  });
});

export default addComment;
