import cloudinary from "cloudinary";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// DELETE POST ///

const deletePost = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler("please enter post id in query params", 400));
  }

  const post = await models.Post.findById(req.query.id);

  if (!post) {
    return next(new ErrorHandler("post not found", 404));
  }

  if (post.owner.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("unauthorized operation", 401));
  }

  for (let i = 0; i < post.mediaFiles.length; i++) {
    let publicId = post.mediaFiles[i].public_id;
    let mediaType = post.mediaFiles[i].mediaType;

    if (mediaType === "video") {
      let thumbnail = post.mediaFiles[i].thumbnail;
      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);
      }
      await cloudinary.v2.uploader.destroy(publicId, { resource_type: "video" });
    } else {
      await cloudinary.v2.uploader.destroy(publicId);
    }
  }

  await post.remove();

  const user = await models.User.findById(req.user._id);

  const index = user.posts.indexOf(req.query.id);

  user.posts.splice(index, 1);
  user.postsCount--;

  await user.save();

  res.status(200).json({
    success: true,
    message: "post deleted successfully",
  });
});

export default deletePost;
