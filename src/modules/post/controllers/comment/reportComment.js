import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import ResponseMessages from "../../../../contants/responseMessages.js";
import models from "../../../../models/index.js";
import validators from "../../../../utils/validators.js";

/// REPORT COMMENT ///

const reportComment = catchAsyncError(async (req, res, next) => {
    let { commentId, reportType, reportReason } = req.body;

    if (!commentId) {
        return next(new ErrorHandler(ResponseMessages.COMMENT_ID_REQUIRED, 400));
    }

    if (!reportType) {
        return next(new ErrorHandler(ResponseMessages.REPORT_TYPE_REQUIRED, 400));
    }

    if (!reportReason) {
        return next(new ErrorHandler(ResponseMessages.REPORT_REASON_REQUIRED, 400));
    }

    if (!validators.isValidObjectId(commentId)) {
        return next(new ErrorHandler(ResponseMessages.INVALID_COMMENT_ID, 400));
    }

    const reporter = req.user._id;

    const commentReport = await models.CommentReport.create({
        comment: commentId,
        reporter,
        reportType,
        reportReason,
    });

    res.status(200).json({
        success: true,
        report: commentReport,
        message: ResponseMessages.REPORT_COMMENT_SUCCESS,
    });
});

export default reportComment;
