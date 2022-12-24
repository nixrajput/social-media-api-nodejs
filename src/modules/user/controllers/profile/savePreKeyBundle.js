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

    const userPreKeyBundle = await models.PreKeyBundle.findOne({ user: req.user._id });

    if (userPreKeyBundle && userPreKeyBundle.preKeyBundle === preKeyBundle) {
        return res.status(200).json({
            success: true,
            preKeyBundle: userPreKeyBundle.preKeyBundle,
            message: ResponseMessages.PREKEY_BUNDLE_ALREADY_EXISTS,
        });
    }

    if (userPreKeyBundle) {
        userPreKeyBundle.preKeyBundle = preKeyBundle;
        await userPreKeyBundle.save();
    } else {
        await models.PreKeyBundle.create({
            user: req.user._id,
            preKeyBundle,
        });
    }

    res.status(200).json({
        success: true,
        preKeyBundle,
        message: ResponseMessages.PREKEY_BUNDLE_SAVED,
    });
});

export default savePreKeyBundle;
