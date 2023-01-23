import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// GET POST DETAILS -- ADMIN ///

const getPostDetails = catchAsyncError(async (req, res, next) => {
    const postId = req.query.id;

    if (!postId) {
        return next(new ErrorHandler(ResponseMessages.POST_ID_REQUIRED, 400));
    }

    const post = await models.Post.findOne({ _id: postId })
        .select("-__v")
        .populate("owner", [
            "fname", "lname", "uname", "email", "avatar",
            "accountStatus", "isVerified", "verificationRequestedAt",
            "verifiedAt", "role", "createdAt", "updatedAt"
        ],
        )
        .populate("pollOptions", "-__v");

    if (!post) {
        return next(new ErrorHandler(ResponseMessages.POST_NOT_FOUND, 404));
    }

    res.status(200).json({
        success: true,
        post: post,
    });
});

export default getPostDetails;
