import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// GET POST DETAILS -- ADMIN ///

const getPostDetails = catchAsyncError(async (req, res, next) => {
    const postId = req.query.id;

    if (!postId) {
        return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
    }

    const post = await models.Post.findOne({ _id: postId })
        .select("-__v")
        .populate({
            path: "owner",
            model: "User",
            select: [
                "_id", "fname", "lname", "email", "uname", "avatar",
                "isPrivate", "isVerified", "accountStatus", "createdAt",
                "updatedAt"
            ],
        });

    if (!post) {
        return next(new ErrorHandler(ResponseMessages.POST_NOT_FOUND, 404));
    }

    const postData = {};
    const hashtags = await utility.getHashTags(post.caption);
    const mentions = await utility.getMentions(post.caption);

    postData._id = post._id;
    postData.caption = post.caption;
    postData.mediaFiles = post.mediaFiles;
    postData.owner = post.owner;
    postData.hashtags = hashtags;
    postData.userMentions = mentions;
    postData.postType = post.postType;
    postData.likesCount = post.likesCount;
    postData.commentsCount = post.commentsCount;
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

    res.status(200).json({
        success: true,
        post: postData,
    });
});

export default getPostDetails;
