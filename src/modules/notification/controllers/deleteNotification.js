import catchAsyncError from "../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../helpers/errorHandler.js";
import models from "../../../models/index.js";
import ResponseMessages from "../../../contants/responseMessages.js";

/// DELETE NOTIFICATION ///

const deleteNotification = catchAsyncError(async (req, res, next) => {
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

    await notification.remove();

    res.status(200).json({
        success: true,
        message: ResponseMessages.NOTIFICATION_DELETED,
    });
});

export default deleteNotification;
