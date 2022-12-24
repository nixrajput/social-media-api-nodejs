import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// CREATE POST ///

const createUploadPost = catchAsyncError(async (req, res, next) => {
    const mediaFiles = req.files;
    const videoFilesTypes = [".mp4", ".mkv"];

    if (!mediaFiles || mediaFiles?.length <= 0) {
        return next(new ErrorHandler("media file is required", 400));
    }

    for (let i = 0; i < mediaFiles.length; i++) {
        let tempFile = mediaFiles[i];

        const fileSize = tempFile.size / 1024;
        let ext = path.extname(tempFile.originalname);

        if (videoFilesTypes.includes(ext)) {
            if (fileSize > 30 * 1024) {
                return next(
                    new ErrorHandler("video file size must be lower than 30mb", 413)
                );
            }
        } else {
            if (fileSize > 2048) {
                return next(
                    new ErrorHandler("image file size must be lower than 2mb", 413)
                );
            }
        }
    }

    let mediaFilesLinks = [];

    for (let i = 0; i < mediaFiles.length; i++) {
        let fileTempPath = mediaFiles[i].path;
        let fileExt = path.extname(mediaFiles[i].originalname);

        if (videoFilesTypes.includes(fileExt)) {
            await cloudinary.v2.uploader
                .upload(fileTempPath, {
                    folder: "social_media_api/posts/videos",
                    resource_type: "video",
                    chunk_size: 6000000,
                })
                .then(async (result) => {
                    mediaFilesLinks.push({
                        public_id: result.public_id,
                        url: result.secure_url,
                        mediaType: "video",
                    });

                    fs.unlink(fileTempPath, (err) => {
                        if (err) console.log(err);
                    });
                })
                .catch((err) => {
                    fs.unlink(fileTempPath, (fileErr) => {
                        if (fileErr) console.log(fileErr);
                    });

                    console.log(err);

                    res.status(400).json({
                        success: false,
                        message: "video upload failed",
                    });
                });
        } else {
            await cloudinary.v2.uploader
                .upload(fileTempPath, {
                    folder: "social_media_api/posts/images",
                })
                .then(async (result) => {
                    mediaFilesLinks.push({
                        public_id: result.public_id,
                        url: result.secure_url,
                        mediaType: "image",
                    });

                    fs.unlink(fileTempPath, (err) => {
                        if (err) console.log(err);
                    });
                })
                .catch((err) => {
                    fs.unlink(fileTempPath, (fileErr) => {
                        if (fileErr) console.log(fileErr);
                    });

                    console.log(err);

                    res.status(400).json({
                        success: false,
                        message: "image upload failed",
                    });
                });
        }
    }

    const newPost = {
        owner: req.user._id,
        mediaFiles: mediaFilesLinks,
        caption: req.body.caption,
        visibility: req.body.visibility,
    };

    const post = await models.Post.create(newPost);

    const user = await models.User.findById(req.user._id);

    user.posts.push(post._id);
    user.postsCount++;

    await user.save();

    res.status(201).json({
        success: true,
        message: "post created successfully",
        post,
    });
});

export default createUploadPost;
