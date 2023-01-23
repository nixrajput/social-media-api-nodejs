import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// @route  GET /api/v1/admin/remove-verification-status

const removeVerificationStatus = catchAsyncError(async (req, res, next) => {
    const { id } = req.query;

    if (!id) {
        return next(new ErrorHandler(ResponseMessages.USER_ID_REQUIRED, 400));
    }

    const user = await models.User.findById(id);

    if (!user) {
        return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
    }

    if (!user.isVerified) {
        return next(new ErrorHandler(ResponseMessages.USER_NOT_VERIFIED, 400));
    }

    user.isVerified = false;
    user.verifiedAt = null;
    user.verificationRequestedAt = null;

    await user.save();

    res.status(200).json({
        success: true,
        message: ResponseMessages.VERIFICATION_REMOVED,
    });
});

export default removeVerificationStatus;