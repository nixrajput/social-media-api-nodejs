import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";
import { sendNotification } from "../../../../firebase/index.js";

/// LIKE/UNLIKE POST ///

const likeUnlikePost = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
  }

  const post = await models.Post.findById(req.query.id)
    .select(["_id", "owner", "likesCount", "mediaFiles"]);

  if (!post) {
    return next(new ErrorHandler(ResponseMessages.POST_NOT_FOUND, 404));
  }

  const isLiked = await utility.checkIfPostLiked(post._id, req.user);

  if (isLiked) {
    await models.PostLike.findOneAndDelete({ post: post._id, user: req.user._id });
    post.likesCount--;

    await post.save();

    res.status(200).json({
      success: true,
      message: ResponseMessages.POST_UNLIKED,
    });
  } else {
    await models.PostLike.create({ post: post._id, user: req.user._id });

    post.likesCount++;
    await post.save();

    const notification = await models.Notification.findOne({
      to: post.owner,
      from: req.user._id,
      refId: post._id,
      type: "postLike",
    });

    const isPostOwner = await utility.checkIfPostOwner(post._id, req.user);

    if (!notification && !isPostOwner) {
      const noti = await models.Notification.create({
        to: post.owner,
        from: req.user._id,
        body: "liked your post",
        refId: post._id,
        type: "postLike",
      });

      const notificationData = await utility.getNotificationData(noti._id, req.user);

      const fcmToken = await models.FcmToken.findOne({ user: post.owner })
        .select("token");

      if (fcmToken) {
        let image = null;
        if (post.postType === "media") {
          image = post.mediaFiles[0].mediaType === "image" ?
            post.mediaFiles[0].url :
            post.mediaFiles[0].thumbnail.url;
        }

        await sendNotification(
          fcmToken.token,
          {
            title: "New Like",
            body: `${notificationData.from.uname} liked your post.`,
            type: "Likes",
            image: image,
          }
        );
      }
    }

    res.status(200).json({
      success: true,
      message: ResponseMessages.POST_LIKED,
    });
  }
});

export default likeUnlikePost;
