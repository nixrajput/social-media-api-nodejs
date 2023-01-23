import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// @route  GET api/v1/admin/verification-request-details

const getVerificationRequestDetails = catchAsyncError(async (req, res, next) => {
    const { id } = req.query;

    if (!id) {
        return next(new ErrorHandler(ResponseMessages.VERIFICATION_REQUEST_ID_REQUIRED, 400));
    }

    const verificationRequest = await models.VerificationRequest.findById(id);

    if (!verificationRequest) {
        return next(new ErrorHandler(ResponseMessages.VERIFICATION_REQUEST_NOT_FOUND, 404));
    }

    res.status(200).json({
        success: true,
        message: ResponseMessages.VERIFICATION_REQUEST_DETAILS,
        data: verificationRequest
    });
});

export default getVerificationRequestDetails;
