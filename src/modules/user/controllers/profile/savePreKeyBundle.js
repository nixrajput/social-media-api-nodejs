import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// SAVE PREKEY BUNDLE ///

const savePreKeyBundle = catchAsyncError(async (req, res, next) => {
    const { preKeyBundle } = req.body;

    if (!preKeyBundle) {
        return next(new ErrorHandler(ResponseMessages.INVALID_REQUEST, 400));
    }

    const user = await models.User.findById(req.user._id).select("_id preKeyBundle");

    if (!user) {
        return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
    }

    user.preKeyBundle = preKeyBundle;

    await user.save();

    res.status(200).json({
        success: true,
        message: ResponseMessages.PREKEY_BUNDLE_SAVED,
    });
});

export default savePreKeyBundle;
