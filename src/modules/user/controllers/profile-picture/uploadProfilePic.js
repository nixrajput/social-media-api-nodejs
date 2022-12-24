import cloudinary from "cloudinary";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import ResponseMessages from "../../../../contants/responseMessages.js";

/// UPLOAD PROFILE PICTURE ///

const uploadProfilePicture = catchAsyncError(async (req, res, next) => {
    const { public_id, url } = req.body;

    if (!public_id) {
        return next(new ErrorHandler(ResponseMessages.PUBLIC_ID_REQUIRED, 400));
    }

    if (!url) {
        return next(new ErrorHandler(ResponseMessages.URL_REQUIRED, 400));
    }

    const user = await models.User.findById(req.user._id);

    if (!user) {
        return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
    }

    if (user.avatar && user.avatar.public_id) {
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);
    }

    user.avatar = {
        public_id: public_id,
        url: url,
    };

    await user.save();

    res.status(200).json({
        success: true,
        message: ResponseMessages.PROFILE_PICTURE_UPLOAD_SUCCESS,
    });

});

export default uploadProfilePicture;
