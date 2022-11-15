import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import ResponseMessages from "../../../../contants/responseMessages.js";
import models from "../../../../models/index.js";
import validators from "../../../../utils/validators.js";

/// REPORT USER ///

const reportUser = catchAsyncError(async (req, res, next) => {
    let { userId, reportType, reportReason } = req.body;

    if (!userId) {
        return next(new ErrorHandler(ResponseMessages.USER_ID_REQUIRED, 400));
    }

    if (!reportType) {
        return next(new ErrorHandler(ResponseMessages.REPORT_TYPE_REQUIRED, 400));
    }

    if (!reportReason) {
        return next(new ErrorHandler(ResponseMessages.REPORT_REASON_REQUIRED, 400));
    }

    if (!validators.isValidObjectId(userId)) {
        return next(new ErrorHandler(ResponseMessages.INVALID_USER_ID, 400));
    }

    const reporter = req.user._id;

    const userReport = await models.UserReport.create({
        user: userId,
        reporter,
        reportType,
        reportReason,
    });

    res.status(200).json({
        success: true,
        report: userReport,
        message: ResponseMessages.REPORT_USER_SUCCESS,
    });
});

export default reportUser;
