import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import ResponseMessages from "../../../../contants/responseMessages.js";
import models from "../../../../models/index.js";
import validators from "../../../../utils/validators.js";

/// @route   POST api/v1/report-comment-reply

const reportCommentReply = catchAsyncError(async (req, res, next) => {
    let { commentReplyId, reportReason } = req.body;

    if (!commentReplyId) {
        return next(new ErrorHandler(ResponseMessages.COMMENT_REPLY_ID_REQUIRED, 400));
    }

    if (!reportReason) {
        return next(new ErrorHandler(ResponseMessages.REPORT_REASON_REQUIRED, 400));
    }

    if (!validators.isValidObjectId(commentReplyId)) {
        return next(new ErrorHandler(ResponseMessages.INVALID_COMMENT_ID, 400));
    }

    const reporter = req.user._id;

    const commentReplyReport = await models.CommentReplyReport.create({
        commentReply: commentReplyId,
        reporter,
        reportReason,
    });

    if (!commentReplyReport) {
        return next(new ErrorHandler(ResponseMessages.REPORT_NOT_CREATED, 500));
    }

    res.status(200).json({
        success: true,
        message: ResponseMessages.REPORT_CREATED,
        data: commentReplyReport,
    });
});

export default reportCommentReply;
