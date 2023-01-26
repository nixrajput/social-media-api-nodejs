import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";
import { sendNotification } from "../../../../firebase/index.js";

/// @route GET /api/v1/add-comment-reply

const addCommentReply = catchAsyncError(async (req, res, next) => {
    const { commentId, reply } = req.body;

    if (!commentId) {
        return next(new ErrorHandler(ResponseMessages.COMMENT_ID_REQUIRED, 400));
    }

    if (!reply) {
        return next(new ErrorHandler(ResponseMessages.REPLY_REQUIRED, 400));
    }

    const comment = await models.Comment.findById(commentId)
        .select("_id user repliesCount post");

    if (!comment) {
        return next(new ErrorHandler(ResponseMessages.COMMENT_NOT_FOUND, 404));
    }

    const newCommentReply = await models.CommentReply.create({
        reply: reply,
        comment: commentId,
        post: comment.post,
        user: req.user._id,
    });

    if (!newCommentReply) {
        return next(new ErrorHandler(ResponseMessages.COMMENT_REPLY_NOT_CREATED, 400));
    }

    comment.repliesCount++;
    await comment.save();

    let mentions = utility.getMentions(comment);

    if (mentions.length > 0) {
        for (let i = 0; i < mentions.length; i++) {
            const mentionedUser = await models.User.
                findOne({ uname: mentions[i] })
                .select("_id uname");

            const isCommentOwner = await utility
                .checkIfCommentOwner(commentId, mentionedUser);

            if (mentionedUser && !isCommentOwner) {
                const mentionNotif = await models.Notification.create({
                    to: mentionedUser._id,
                    from: req.user._id,
                    refId: comment.post,
                    body: `mentioned you in a comment.`,
                    type: "commentMention"
                });

                const notificationData = await utility
                    .getNotificationData(mentionNotif._id, req.user);

                const fcmToken = await models.FcmToken
                    .findOne({ user: mentionedUser._id })
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

    if (comment.user.toString() !== req.user._id.toString()) {
        const noti = await models.Notification.create({
            to: comment.user,
            from: req.user._id,
            body: "replied to your comment.",
            refId: comment.post,
            type: "commentReply",
        });

        const notificationData = await utility
            .getNotificationData(noti._id, req.user);

        const fcmToken = await models.FcmToken.findOne({ user: comment.user })
            .select("token");

        if (fcmToken) {
            await sendNotification(
                fcmToken.token,
                {
                    title: "New Reply",
                    body: `${notificationData.from.uname} replied to your comment.`,
                    type: "CommentReplies",
                }
            );
        }
    }

    const commentReplyData = await utility
        .getCommentReplyData(newCommentReply._id, req.user);

    res.status(200).json({
        success: true,
        message: ResponseMessages.COMMENT_REPLY_ADD_SUCCESS,
        comment: commentReplyData,
    });
});

export default addCommentReply;