import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// @route  GET /api/v1/admin/approve-verification-request

const approveVerificationRequest = catchAsyncError(async (req, res, next) => {
    const { id } = req.query;

    if (!id) {
        return next(new ErrorHandler(ResponseMessages.VERIFICATION_REQUEST_ID_REQUIRED, 400));
    }

    const verificationRequest = await models.VerificationRequest.findById(id);

    if (!verificationRequest) {
        return next(new ErrorHandler(ResponseMessages.VERIFICATION_REQUEST_NOT_FOUND, 404));
    }

    if (verificationRequest.status !== "pending") {
        return next(new ErrorHandler(ResponseMessages.VERIFICATION_REQUEST_ALREADY_PROCESSED, 400));
    }

    verificationRequest.status = "approved";
    verificationRequest.approvedAt = Date.now();
    verificationRequest.approvedBy = req.user._id;

    await verificationRequest.save();

    const user = await models.User.findById(verificationRequest.user._id);

    if (!user) {
        return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
    }

    user.isValid = true;
    user.isVerified = true;
    user.verifiedCategory = verificationRequest.category;
    user.verifiedAt = Date.now();
    user.verificationRequestedAt = null;

    await user.save();

    res.status(200).json({
        success: true,
        message: ResponseMessages.VERIFICATION_REQUEST_APPROVED,
    });
});

export default approveVerificationRequest;