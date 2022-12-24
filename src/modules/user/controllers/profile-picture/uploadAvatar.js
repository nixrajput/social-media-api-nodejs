import cloudinary from "cloudinary";
import fs from "fs";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// UPLOAD Avatar ///

const uploadAvatar = catchAsyncError(async (req, res, next) => {
  const avatar = req.file;

  if (!avatar) {
    return next(new ErrorHandler("please provide an avatar image", 400));
  }

  const fileSize = avatar.size / 1024;

  if (fileSize > 2048) {
    return next(new ErrorHandler("image size must be lower than 2mb", 413));
  }

  const user = await models.User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  const fileTempPath = avatar.path;

  if (fileTempPath) {
    if (user.avatar && user.avatar.public_id) {
      const imageId = user.avatar.public_id;
      await cloudinary.v2.uploader.destroy(imageId);
    }

    await cloudinary.v2.uploader
      .upload(fileTempPath, {
        folder: "social_media_api/avatars",
      })
      .then(async (result) => {
        user.avatar = {
          public_id: result.public_id,
          url: result.secure_url,
        };

        await user.save();

        fs.unlink(fileTempPath, (err) => {
          if (err) console.log(err);
        });

        res.status(200).json({
          success: true,
          message: "profile picture uploaded successfully",
        });
      })
      .catch((err) => {
        fs.unlink(fileTempPath, (fileErr) => {
          if (fileErr) console.log(fileErr);
        });

        console.log(err);

        res.status(400).json({
          success: false,
          message: "an error occurred in uploading image",
        });
      });
  } else {
    res.status(400).json({
      success: false,
      message: "image path is invalid",
    });
  }
});

export default uploadAvatar;
