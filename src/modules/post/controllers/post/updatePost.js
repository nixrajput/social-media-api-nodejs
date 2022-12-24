import cloudinary from "cloudinary";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// UPDATE POST ///

const updatePost = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler("please enter post id in query params", 400));
  }

  const { caption } = req.body;

  const post = await models.Post.findById(req.query.id);

  if (!post) {
    return next(new ErrorHandler("post not found", 404));
  }

  if (post.owner.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("unauthorized operation", 401));
  }

  if (caption) {
    post.caption = caption;
  }

  if (req.body.images) {
    if (post.images.length > 0) {
      for (let i = 0; i < post.images.length; i++) {
        await cloudinary.v2.uploader.destroy(post.images[i].public_id);
      }
    }

    let postImages = [];

    if (typeof req.body.images === "string") {
      postImages.push(req.body.images);
    } else {
      postImages = req.body.images;
    }

    if (postImages !== undefined) {
      let imageLinks = [];

      for (let i = 0; i < postImages.length; i++) {
        const result = await cloudinary.v2.uploader.upload(postImages[i], {
          folder: "nixlab/posts",
        });

        imageLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      req.body.images = imageLinks;

      post.images = req.body.images;
    }
  }

  await post.save();

  res.status(200).json({
    success: true,
    message: "post updated successfully",
  });
});

export default updatePost;
