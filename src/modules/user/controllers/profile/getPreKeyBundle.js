import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// GET PREKEY BUNDLE ///

const getPreKeyBundle = catchAsyncError(async (req, res, next) => {
    const user = await models.User.findById(req.user._id).select("_id preKeyBundle");

    if (!user) {
        return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
    }

    if (!user.preKeyBundle) {
        return next(new ErrorHandler(ResponseMessages.PREKEY_BUNDLE_NOT_FOUND, 404));
    }

    res.status(200).json({
        success: true,
        data: {
            preKeyBundle: user.preKeyBundle,
        },
        message: ResponseMessages.PREKEY_BUNDLE_RECEIVED,
    });
});

export default getPreKeyBundle;
