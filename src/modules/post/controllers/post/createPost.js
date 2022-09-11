import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// CREATE POST ///

const createPost = catchAsyncError(async (req, res, next) => {
  let { mediaFiles, caption } = req.body;

  if (!mediaFiles || mediaFiles?.length <= 0) {
    return next(new ErrorHandler(ResponseMessages.MEDIA_FILES_REQUIRED, 400));
  }

  for (let i = 0; i < mediaFiles.length; i++) {
    if (!mediaFiles[i].public_id) {
      return next(new ErrorHandler(ResponseMessages.PUBLIC_ID_REQUIRED, 400));
    }
    if (!mediaFiles[i].url) {
      return next(new ErrorHandler(ResponseMessages.URL_REQUIRED, 400));
    }
    if (!mediaFiles[i].mediaType) {
      return next(new ErrorHandler(ResponseMessages.MEDIA_TYPE_REQUIRED, 400));
    }
    if (mediaFiles[i].mediaType === "video" && !mediaFiles[i].thumbnail) {
      return next(new ErrorHandler(ResponseMessages.VIDEO_THUMBNAIL_REQUIRED, 400));
    }

    if (mediaFiles[i].mediaType === "video" && !mediaFiles[i].thumbnail.public_id) {
      return next(new ErrorHandler(ResponseMessages.VIDEO_THUMBNAIL_PUBLIC_ID_REQUIRED, 400));
    }

    if (mediaFiles[i].mediaType === "video" && !mediaFiles[i].thumbnail.url) {
      return next(new ErrorHandler(ResponseMessages.VIDEO_THUMBNAIL_URL_REQUIRED, 400));
    }
  }

  const newPost = {
    owner: req.user._id,
    caption: caption,
    mediaFiles: mediaFiles,
  };

  const post = await models.Post.create(newPost);

  const user = await models.User.findById(req.user._id);

  user.posts.push(post._id);
  user.postsCount++;

  await user.save();

  const ownerData = await utility.getOwnerData(post.owner, req.user);

  const isLiked = await utility.checkIfPostLiked(post._id, req.user);

  const postData = {};
  postData._id = post._id;
  postData.caption = post.caption;
  postData.mediaFiles = post.mediaFiles;
  postData.owner = ownerData;
  postData.likesCount = post.likesCount;
  postData.commentsCount = post.commentsCount;
  postData.isLiked = isLiked;
  postData.postStatus = post.postStatus;
  postData.createdAt = post.createdAt;

  res.status(201).json({
    success: true,
    message: ResponseMessages.POST_CREATE_SUCCESS,
    post: postData,
  });
});

export default createPost;
