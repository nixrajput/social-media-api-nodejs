import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// GET USER POSTS ///

const getUserPosts = catchAsyncError(async (req, res, next) => {
    const user = await models.User.findById(req.query.id)
        .select("_id accountPrivacy");

    if (!user) {
        return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
    }

    let currentPage = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    if (user.accountPrivacy === "private") {
        const followingStatus = await utility.getFollowingStatus(req.user, user._id);
        const isSameUser = await utility.checkIfSameUser(req.user, user._id);
        if (followingStatus === "following" || isSameUser) {

            const posts = await models.Post.find({
                owner: user._id,
                postStatus: "active",
            })
                .select("_id").sort({ createdAt: -1 });

            let totalPosts = posts.length;
            let totalPages = Math.ceil(totalPosts / limit);

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

            const slicedPosts = posts.slice(skip, skip + limit);

            const results = [];

            for (let postId of slicedPosts) {
                const postData = await utility.getPostData(postId, req.user);

                if (postData) {
                    results.push(postData);
                }
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

        } else {
            res.status(200).json({
                success: true,
                currentPage: 0,
                totalPages: 0,
                limit: 0,
                hasPrevPage: false,
                prevPage: null,
                hasNextPage: false,
                nextPage: null,
                results: [],
            });
        }
    } else {
        const posts = await models.Post.find({
            owner: user._id,
            postStatus: "active",
        })
            .select("_id").sort({ createdAt: -1 });

        let totalPosts = posts.length;
        let totalPages = Math.ceil(totalPosts / limit);

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

        const slicedPosts = posts.slice(skip, skip + limit);

        const results = [];

        for (let postId of slicedPosts) {
            const postData = await utility.getPostData(postId, req.user);

            if (postData) {
                results.push(postData);
            }
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
    }
});

export default getUserPosts;
