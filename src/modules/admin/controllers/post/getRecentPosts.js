import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import models from "../../../../models/index.js";

/// GET RECENT POSTS  -- ADMIN ///

const getRecentPosts = catchAsyncError(async (req, res, next) => {
    let limit = parseInt(req.query.limit) || 10;

    const results = await models.Post.find()
        .select("-__v")
        .limit(limit)
        .populate({
            path: "owner",
            select: "fname lname uname email avatar role",
        })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        limit,
        results,
    });
});

export default getRecentPosts;
