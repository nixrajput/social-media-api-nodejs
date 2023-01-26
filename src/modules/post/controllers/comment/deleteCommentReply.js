import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// @route  DELETE /api/v1/delete-comment-reply

const deleteCommentReply = catchAsyncError(async (req, res, next) => {
    const replyId = req.query.id;

    if (!replyId) {
        return next(new ErrorHandler(ResponseMessages.COMMENT_REPLY_ID_REQUIRED, 400));
    }

    const commentReply = await models.CommentReply.findById(replyId);

    if (!commentReply) {
        return next(new ErrorHandler(ResponseMessages.COMMENT_REPLY_NOT_FOUND, 404));
    }

    const comment = await models.Comment.findById(commentReply.comment)
        .select("_id user repliesCount");

    if (!comment) {
        return next(new ErrorHandler(ResponseMessages.COMMENT_NOT_FOUND, 404));
    }

    if (commentReply.user.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler(ResponseMessages.UNAUTHORIZED, 401));
    }

    if (commentReply.likesCount > 0) {
        const likes = await models.CommentReplyLike
            .find({ commentReply: commentReply._id });

        for (let i = 0; i < likes.length; i++) {
            await likes[i].remove();
        }

        commentReply.likesCount = 0;
    }

    await commentReply.remove();

    comment.repliesCount--;
    await comment.save();

    return res.status(200).json({
        success: true,
        message: ResponseMessages.COMMENT_REPLY_DELETE_SUCCESS,
    });
});

export default deleteCommentReply;
