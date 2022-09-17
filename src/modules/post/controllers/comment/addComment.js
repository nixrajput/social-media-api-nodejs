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
  await post.save();

  let mentions = utility.getMentions(caption);

  if (mentions.length > 0) {
    for (let i = 0; i < mentions.length; i++) {
      const mentionedUser = await models.User.findOne({ uname: mentions[i] })
        .select(["_id", "uname"]);

      const isPostOwner = await utility.checkIfPostOwner(post._id, mentionedUser);

      if (mentionedUser && !isPostOwner) {
        await models.Notification.create({
          to: mentionedUser._id,
          from: req.user._id,
          refId: newComment._id,
          body: `mentioned you in a comment`,
          type: "commentMention"
        });
      }
    }
  }

  if (post.owner.toString() !== req.user._id.toString()) {
    await models.Notification.create({
      to: post.owner,
      from: req.user._id,
      body: "commented on your post.",
      refId: post._id,
      type: "postComment",
    });
  }

  const commentData = await utility.getCommentData(newComment._id, req.user);

  res.status(200).json({
    success: true,
    message: ResponseMessages.COMMENT_ADD_SUCCESS,
    comment: commentData,
  });
});

export default addComment;
