import catchAsyncError from "../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../helpers/errorHandler.js";
import models from "../../../models/index.js";
import ResponseMessages from "../../../contants/responseMessages.js";

/// MARK READ NOTIFICATION ///

const markReadNotification = catchAsyncError(async (req, res, next) => {
    if (!req.query.id) {
        return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
    }

    const notification = await models.Notification.findById(req.query.id);

    if (!notification) {
        return next(new ErrorHandler(ResponseMessages.NOTIFICATION_NOT_FOUND, 404));
    }

    if (notification.to.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler(ResponseMessages.UNAUTHORIZED, 401));
    }

    if (notification.isRead) {
        return res.status(200).json({
            success: true,
            message: ResponseMessages.NOTIFICATION_ALREADY_READ
        });
    }

    notification.isRead = true;
    await notification.save();
    return res.status(200).json({
        success: true,
        message: ResponseMessages.NOTIFICATION_MARKED_READ
    });
});

export default markReadNotification;
