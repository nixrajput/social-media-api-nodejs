import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

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
  post.commentsCount++;

  if (post.owner.toString() !== req.user._id.toString()) {
    await models.Notification.create({
      owner: post.owner,
      user: req.user._id,
      body: "commented on your post.",
      refId: post._id,
      type: "comment",
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
    message: "comment added successfully",
    comment: commentData,
  });
});

export default addComment;
