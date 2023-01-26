import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";
import { sendNotification } from "../../../../firebase/index.js";

/// @route POST  /api/v1/add-comment

const addComment = catchAsyncError(async (req, res, next) => {
  const { comment, postId } = req.body;

  const id = postId || req.query.postId;

  if (!id) {
    return next(new ErrorHandler(ResponseMessages.POST_ID_REQUIRED, 400));
  }

  if (!comment) {
    return next(new ErrorHandler(ResponseMessages.COMMENT_REQUIRED, 400));
  }

  const post = await models.Post.findById(id)
    .select("_id owner commentsCount mediaFiles");

  if (!post) {
    return next(new ErrorHandler(ResponseMessages.POST_NOT_FOUND, 404));
  }

  const newComment = await models.Comment.create({
    comment: comment,
    user: req.user._id,
    post: id,
  });

  post.commentsCount++;
  await post.save();

  let mentions = utility.getMentions(comment);

  if (mentions.length > 0) {
    for (let i = 0; i < mentions.length; i++) {
      const mentionedUser = await models.User.findOne({ uname: mentions[i] })
        .select(["_id", "uname"]);

      const isPostOwner = await utility.checkIfPostOwner(post._id, mentionedUser);

      if (mentionedUser && !isPostOwner) {
        const mentionNotif = await models.Notification.create({
          to: mentionedUser._id,
          from: req.user._id,
          refId: newComment._id,
          body: `mentioned you in a comment.`,
          type: "commentMention"
        });

        const notificationData = await utility
          .getNotificationData(mentionNotif._id, req.user);

        const fcmToken = await models.FcmToken.findOne({ user: mentionedUser._id })
          .select("token");

        if (fcmToken) {
          await sendNotification(
            fcmToken.token,
            {
              title: "New Mention",
              body: `${notificationData.from.uname} mentioned you in a comment.`,
              type: "Mentions",
            }
          );
        }
      }
    }
  }

  if (post.owner.toString() !== req.user._id.toString()) {
    const noti = await models.Notification.create({
      to: post.owner,
      from: req.user._id,
      body: "commented on your post.",
      refId: post._id,
      type: "postComment",
    });

    const notificationData = await utility.getNotificationData(noti._id, req.user);

    const fcmToken = await models.FcmToken.findOne({ user: post.owner })
      .select("token");

    if (fcmToken) {
      await sendNotification(
        fcmToken.token,
        {
          title: "New Comment",
          body: `${notificationData.from.uname} commented on your post.`,
          type: "Comments",
        }
      );
    }
  }

  const commentData = await utility.getCommentData(newComment._id, req.user);

  res.status(200).json({
    success: true,
    message: ResponseMessages.COMMENT_ADD_SUCCESS,
    comment: commentData,
  });
});

export default addComment;
