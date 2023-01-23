import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// @route  POST /api/v1/admin/reject-verification-request

const rejectVerificationRequest = catchAsyncError(async (req, res, next) => {
    const { id, reason } = req.body;

    if (!id) {
        return next(new ErrorHandler(ResponseMessages.VERIFICATION_REQUEST_ID_REQUIRED, 400));
    }

    if (!reason) {
        return next(new ErrorHandler(ResponseMessages.VERIFICATION_REQUEST_REJECTION_REASON_REQUIRED, 400));
    }

    const verificationRequest = await models.VerificationRequest.findById(id)

    if (!verificationRequest) {
        return next(new ErrorHandler(ResponseMessages.VERIFICATION_REQUEST_NOT_FOUND, 404));
    }

    if (verificationRequest.status !== "pending") {
        return next(new ErrorHandler(ResponseMessages.VERIFICATION_REQUEST_ALREADY_PROCESSED, 400));
    }

    verificationRequest.status = "rejected";
    verificationRequest.rejectedAt = Date.now();
    verificationRequest.reason = reason;
    verificationRequest.rejectedBy = req.user._id;

    await verificationRequest.save();

    res.status(200).json({
        success: true,
        message: ResponseMessages.VERIFICATION_REQUEST_REJECTED,
    });
});

export default rejectVerificationRequest;