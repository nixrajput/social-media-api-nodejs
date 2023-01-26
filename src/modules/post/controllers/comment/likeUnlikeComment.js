import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";
import { sendNotification } from "../../../../firebase/index.js";

/// @route GET /api/v1/post/like-comment

const likeUnlikeComment = catchAsyncError(async (req, res, next) => {
  const commentId = req.query.id;

  if (!commentId) {
    return next(new ErrorHandler(ResponseMessages.COMMENT_ID_REQUIRED, 400));
  }

  const comment = await models.Comment.findById(commentId);

  if (!comment) {
    return next(new ErrorHandler(ResponseMessages.COMMENT_NOT_FOUND, 404));
  }

  const isLiked = await utility.checkIfCommentLiked(comment._id, req.user);

  if (isLiked) {
    await models.CommentLike.findOneAndDelete({
      comment: commentId,
      user: req.user._id
    });
    comment.likesCount--;

    await comment.save();

    res.status(200).json({
      success: true,
      message: ResponseMessages.COMMENT_UNLIKED,
    });
  } else {
    await models.CommentLike.create({
      comment: commentId,
      user: req.user._id
    });

    comment.likesCount++;
    await comment.save();

    const notification = await models.Notification.findOne({
      to: comment.user,
      from: req.user._id,
      refId: commentId,
    });

    const isCommentOwner = await utility.checkIfCommentOwner(comment._id, req.user);

    if (!notification && !isCommentOwner) {
      const noti = await models.Notification.create({
        to: comment.user,
        from: req.user._id,
        body: "liked your comment",
        refId: commentId,
        type: "commentLike",
      });

      const notificationData = await utility.getNotificationData(noti._id, req.user);

      const fcmToken = await models.FcmToken.findOne({ user: comment.user })
        .select("token");

      if (fcmToken) {
        await sendNotification(
          fcmToken.token,
          {
            title: "New Like",
            body: `${notificationData.from.uname} liked your comment.`,
            type: "Likes",
          }
        );
      }
    }

    res.status(200).json({
      success: true,
      message: ResponseMessages.COMMENT_LIKED,
    });
  }
});

export default likeUnlikeComment;
