import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// GET PREKEY BUNDLE ///

const getPreKeyBundle = catchAsyncError(async (req, res, next) => {
    const userId = req.query.id || req.user._id;

    if (!userId) {
        return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
    }

    const userPreKeyBundle = await models.PreKeyBundle.findOne({ user: userId });

    if (!userPreKeyBundle) {
        return next(new ErrorHandler(ResponseMessages.PREKEY_BUNDLE_NOT_FOUND, 404));
    }

    res.status(200).json({
        success: true,
        data: {
            preKeyBundle: userPreKeyBundle.preKeyBundle,
        },
        message: ResponseMessages.PREKEY_BUNDLE_RECEIVED,
    });
});

export default getPreKeyBundle;
