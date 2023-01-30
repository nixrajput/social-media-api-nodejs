import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import ResponseMessages from "../../../../contants/responseMessages.js";
import models from "../../../../models/index.js";
import validators from "../../../../utils/validators.js";

/// @route   POST api/v1/report-post

const reportPost = catchAsyncError(async (req, res, next) => {
    let { postId, reportReason } = req.body;

    if (!postId) {
        return next(new ErrorHandler(ResponseMessages.POST_ID_REQUIRED, 400));
    }

    if (!reportReason) {
        return next(new ErrorHandler(ResponseMessages.REPORT_REASON_REQUIRED, 400));
    }

    if (!validators.isValidObjectId(postId)) {
        return next(new ErrorHandler(ResponseMessages.INVALID_POST_ID, 400));
    }

    const reporter = req.user._id;

    const postReport = await models.PostReport.create({
        post: postId,
        reporter,
        reportReason,
    });

    if (!postReport) {
        return next(new ErrorHandler(ResponseMessages.REPORT_NOT_CREATED, 500));
    }

    res.status(200).json({
        success: true,
        message: ResponseMessages.REPORT_CREATED,
        data: postReport,
    });
});

export default reportPost;
