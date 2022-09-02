import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

const getLikedUsers = catchAsyncError(async (req, res, next) => {
    if (!req.query.id) {
        return next(new ErrorHandler("please enter user id in query params", 400));
    }

    const post = await models.Post.findById(req.query.id).select("_id likes")
        .sort({
            createdAt: -1,
        });

    if (!post) {
        return next(new ErrorHandler("post not found", 404));
    }

    const postLikes = post.likes;

    let currentPage = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    let totalLikes = postLikes.length;
    let totalPages = Math.ceil(totalLikes / limit);

    if (currentPage < 1) {
        currentPage = 1;
    }

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    let skip = (currentPage - 1) * limit;

    let prevPageIndex = null;
    let hasPrevPage = false;
    let prevPage = null;
    let nextPageIndex = null;
    let hasNextPage = false;
    let nextPage = null;

    if (currentPage < totalPages) {
        nextPageIndex = currentPage + 1;
        hasNextPage = true;
    }

    if (currentPage > 1) {
        prevPageIndex = currentPage - 1;
        hasPrevPage = true;
    }

    const baseUrl = `${req.protocol}://${req.get("host")}${req.originalUrl
        }`.split("?")[0];

    if (hasPrevPage) {
        prevPage = `${baseUrl}?page=${prevPageIndex}&limit=${limit}`;
    }

    if (hasNextPage) {
        nextPage = `${baseUrl}?page=${nextPageIndex}&limit=${limit}`;
    }

    const slicedPostLikers = postLikes.slice(skip, skip + limit);

    const results = [];

    for (let i = 0; i < slicedPostLikers.length; i++) {
        const postLiker = slicedPostLikers[i];
        const postLikerData = await models.User.findById(postLiker.likedBy)
            .select([
                "_id", "fname", "lname", "email", "uname", "avatar", "profession",
                "accountPrivacy", "accountStatus", "isVerified", "createdAt",
            ]);

        const followingStatus = await utility.getFollowingStatus(req.user, postLikerData._id);

        results.push({
            _id: postLiker._id,
            likedBy: {
                _id: postLikerData._id,
                fname: postLikerData.fname,
                lname: postLikerData.lname,
                email: postLikerData.email,
                uname: postLikerData.uname,
                avatar: postLikerData.avatar,
                followingStatus: followingStatus,
                profession: postLikerData.profession,
                accountPrivacy: postLikerData.accountPrivacy,
                accountStatus: postLikerData.accountStatus,
                isVerified: postLikerData.isVerified,
                createdAt: postLikerData.createdAt,
            },
            likedAt: postLiker.likedAt,
        });
    }

    res.status(200).json({
        success: true,
        currentPage,
        totalPages,
        limit,
        hasPrevPage,
        prevPage,
        hasNextPage,
        nextPage,
        results,
    });
});

export default getLikedUsers;
