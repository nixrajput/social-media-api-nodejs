import cloudinary from "cloudinary";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// REMOVE PROFILE PICTURE ///

const removeProfilePicture = catchAsyncError(async (req, res, next) => {
  const user = await models.User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  if (user.avatar && user.avatar.public_id) {
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
  }

  user.avatar = {};

  await user.save();

  res.status(200).json({
    success: true,
    message: "profile picture removed successfully",
  });
});

export default removeProfilePicture;
