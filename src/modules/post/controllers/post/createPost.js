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

  const user = await models.User.findById(req.user._id).select("_id postsCount");
  user.postsCount++;
  await user.save();

  let hashtags = [];
  let mentions = [];

  if (caption) {
    hashtags = utility.getHashTags(caption);
    mentions = utility.getMentions(caption);

    for (let i = 0; i < mentions.length; i++) {
      const user = await models.User.findOne({ username: mentions[i] })
        .select(["_id", "username"]);

      const notification = await models.Notification.findOne({
        user: req.user._id,
        refId: post._id,
      });

      const isPostOwner = await utility.checkIfPostOwner(post._id, req.user);

      if (user && (!notification && !isPostOwner)) {
        await models.Notification.create({
          to: user._id,
          from: req.user._id,
          refId: post._id,
          body: `mentioned you in a post`,
          type: "postMention"
        });
      }
    }

    for (let i = 0; i < hashtags.length; i++) {
      const tag = await models.Tag.findOne({ name: hashtags[i] });

      if (tag) {
        tag.posts.push(post._id);
        tag.postsCount++;
        await tag.save();
      } else {
        await models.Tag.create({
          name: hashtags[i],
          posts: [post._id],
          postsCount: 1,
        });
      }
    }

  }

  const postData = {};

  const ownerData = await utility.getOwnerData(post.owner, req.user);

  const isLiked = await utility.checkIfPostLiked(post._id, req.user);

  postData._id = post._id;
  postData.caption = post.caption;
  postData.mediaFiles = post.mediaFiles;
  postData.owner = ownerData;
  postData.hashtags = hashtags;
  postData.mentions = mentions;
  postData.postType = post.postType;
  postData.likesCount = post.likesCount;
  postData.commentsCount = post.commentsCount;
  postData.isLiked = isLiked;
  postData.isArchived = post.isArchived;
  postData.visibility = post.visibility;
  postData.allowComments = post.allowComments;
  postData.allowLikes = post.allowLikes;
  postData.allowReposts = post.allowReposts;
  postData.allowShare = post.allowShare;
  postData.allowSave = post.allowSave;
  postData.allowDownload = post.allowDownload;
  postData.postStatus = post.postStatus;
  postData.createdAt = post.createdAt;
  postData.updatedAt = post.updatedAt;

  res.status(201).json({
    success: true,
    message: ResponseMessages.POST_CREATE_SUCCESS,
    post: postData,
  });
});

export default createPost;
