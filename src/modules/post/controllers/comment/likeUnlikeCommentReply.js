import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";
import { sendNotification } from "../../../../firebase/index.js";

/// @route GET /api/v1/post/like-comment-reply

const likeUnlikeCommentReply = catchAsyncError(async (req, res, next) => {
  const id = req.query.id;

  if (!id) {
    return next(new ErrorHandler(ResponseMessages.COMMENT_REPLY_ID_REQUIRED, 400));
  }

  const commentReply = await models.CommentReply.findById(id);

  if (!commentReply) {
    return next(new ErrorHandler(ResponseMessages.COMMENT_REPLY_NOT_FOUND, 404));
  }

  const isLiked = await utility.checkIfCommentReplyLiked(commentReply._id, req.user);

  if (isLiked) {
    await models.CommentReplyLike.findOneAndDelete({
      commentReply: commentReply._id,
      user: req.user._id
    });

    commentReply.likesCount--;
    await commentReply.save();

    res.status(200).json({
      success: true,
      message: ResponseMessages.UNLIKED,
    });
  } else {
    await models.CommentReplyLike.create({
      commentReply: commentReply._id,
      user: req.user._id
    });

    commentReply.likesCount++;
    await commentReply.save();

    const notification = await models.Notification.findOne({
      to: commentReply.user,
      from: req.user._id,
      refId: commentReply._id,
    });

    const isCommentReplyOwner = await utility.checkIfCommentReplyOwner(commentReply._id, req.user);

    if (!notification && !isCommentReplyOwner) {
      const noti = await models.Notification.create({
        to: commentReply.user,
        from: req.user._id,
        body: "liked your reply",
        refId: commentReply._id,
        type: "commentReplyLike",
      });

      const notificationData = await utility.getNotificationData(noti._id, req.user);

      const fcmToken = await models.FcmToken.findOne({ user: commentReply.user })
        .select("token");

      if (fcmToken) {
        await sendNotification(
          fcmToken.token,
          {
            title: "New Like",
            body: `${notificationData.from.uname} liked your reply.`,
            type: "Likes",
          }
        );
      }
    }

    res.status(200).json({
      success: true,
      message: ResponseMessages.LIKED,
    });
  }
});

export default likeUnlikeCommentReply;
