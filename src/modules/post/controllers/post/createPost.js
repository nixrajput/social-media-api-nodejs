import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// CREATE POST ///

const createPost = catchAsyncError(async (req, res, next) => {
  let { mediaFiles, caption, visibility } = req.body;

  if (!mediaFiles) {
    return next(new ErrorHandler(ResponseMessages.MEDIA_FILES_REQUIRED, 400));
  }

  if (mediaFiles && mediaFiles.length > 0) {
    for (let i = 0; i < mediaFiles.length; i++) {
      if (!mediaFiles[i].mediaType) {
        return next(new ErrorHandler(ResponseMessages.MEDIA_TYPE_REQUIRED, 400));
      }

      if (!mediaFiles[i].public_id) {
        return next(new ErrorHandler(ResponseMessages.PUBLIC_ID_REQUIRED, 400));
      }

      if (!mediaFiles[i].url) {
        return next(new ErrorHandler(ResponseMessages.URL_REQUIRED, 400));
      }

      if (mediaFiles[i].mediaType === "video") {
        if (!mediaFiles[i].thumbnail) {
          return next(new ErrorHandler(ResponseMessages.VIDEO_THUMBNAIL_REQUIRED, 400));
        }

        if (!mediaFiles[i].thumbnail.public_id) {
          return next(new ErrorHandler(ResponseMessages.VIDEO_THUMBNAIL_PUBLIC_ID_REQUIRED, 400));
        }

        if (!mediaFiles[i].thumbnail.url) {
          return next(new ErrorHandler(ResponseMessages.VIDEO_THUMBNAIL_URL_REQUIRED, 400));
        }
      }
    }
  }

  const post = await models.Post.create({
    postType: "media",
    owner: req.user._id,
    caption: caption,
    mediaFiles: mediaFiles,
    visibility: visibility,
  });

  if (mediaFiles.length > 1) {
    for (let i = 0; i < mediaFiles.length; i++) {
      if (mediaFiles[i].mediaType === "image") {
        await models.PostMedia.create({
          post: post._id,
          type: "image",
          publicId: mediaFiles[i].public_id,
          url: mediaFiles[i].url,
        });
      }
      else if (mediaFiles[i].mediaType === "video") {
        await models.PostMedia.create({
          post: post._id,
          type: "video",
          publicId: mediaFiles[i].public_id,
          url: mediaFiles[i].url,
          thumbnail: {
            publicId: mediaFiles[i].thumbnail.public_id,
            url: mediaFiles[i].thumbnail.url,
          },
        });
      }
    }
  }

  const user = await models.User.findById(req.user._id).select("_id postsCount");
  user.postsCount++;
  await user.save();

  let hashtags = [];
  let mentions = [];

  if (caption) {
    hashtags = utility.getHashTags(caption);
    mentions = utility.getMentions(caption);

    if (mentions.length > 0) {
      for (let i = 0; i < mentions.length; i++) {
        const mentionedUser = await models.User.findOne({ uname: mentions[i] })
          .select(["_id", "uname"]);

        const notification = await models.Notification.findOne({
          to: mentionedUser._id,
          from: req.user._id,
          refId: post._id,
          type: "postMention"
        });

        const isPostOwner = await utility.checkIfPostOwner(post._id, mentionedUser);

        if (mentionedUser && (!notification && !isPostOwner)) {
          await models.Notification.create({
            to: mentionedUser._id,
            from: req.user._id,
            refId: post._id,
            body: `mentioned you in a post`,
            type: "postMention"
          });
        }
      }
    }

    for (let i = 0; i < hashtags.length; i++) {
      const tag = await models.Tag.findOne({ name: hashtags[i] });

      if (tag) {
        tag.postsCount++;
        await tag.save();
      } else {
        await models.Tag.create({
          name: hashtags[i],
          postsCount: 1,
        });
      }
    }

  }

  const postData = await utility.getPostData(post._id, req.user);

  res.status(201).json({
    success: true,
    message: ResponseMessages.POST_CREATE_SUCCESS,
    post: postData,
  });
});

export default createPost;
