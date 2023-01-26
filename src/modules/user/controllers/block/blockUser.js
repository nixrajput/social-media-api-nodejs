import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import ResponseMessages from "../../../../contants/responseMessages.js";

/// @route  GET /api/v1/block-user

const blockUser = catchAsyncError(async (req, res, next) => {
    if (!req.query.id) {
        return next(new ErrorHandler(ResponseMessages.USER_ID_REQUIRED, 400));
    }

    if (req.query.id.toString() === req.user._id.toString()) {
        return next(new ErrorHandler(ResponseMessages.CANNOT_BLOCK_YOURSELF, 400));
    }

    const blockedUser = await models.BlockedUser.findOne({
        user: req.user._id,
        blockedUser: req.query.id,
    });

    if (blockedUser) {
        return next(new ErrorHandler(ResponseMessages.USER_ALREADY_BLOCKED, 400));
    }

    const blockUser = await models.BlockedUser.create({
        user: req.user._id,
        blockedUser: req.query.id,
    });

    if (!blockUser) {
        return next(new ErrorHandler(ResponseMessages.BLOCK_USER_FAILED, 500));
    }

    return res.status(200).json({
        success: true,
        message: ResponseMessages.BLOCKED,
        user: req.query.id,
    });
});

export default blockUser;
