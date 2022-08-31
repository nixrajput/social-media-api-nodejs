import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// CREATE POST ///

const createPost = catchAsyncError(async (req, res, next) => {
  let { mediaFiles, caption } = req.body;

  if (!mediaFiles || mediaFiles?.length <= 0) {
    return next(new ErrorHandler("media file is required", 400));
  }

  const newPost = {
    owner: req.user._id,
    caption: caption,
    mediaFiles: mediaFiles,
  };

  const post = await models.Post.create(newPost);

  const user = await models.User.findById(req.user._id);

  user.posts.push(post._id);

  await user.save();

  await post.populate([
    {
      path: "owner",
      model: "User",
      select: [
        "_id",
        "fname",
        "lname",
        "email",
        "uname",
        "avatar",
        "profession",
        "accountType",
        "accountStatus",
        "isVerified",
      ],
    }
  ]);

  res.status(201).json({
    success: true,
    message: "post created successfully",
    post,
  });
});

export default createPost;
