import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// GET USER POSTS ///

const getUserPosts = catchAsyncError(async (req, res, next) => {
    const user = await models.User.findById(req.query.id).select({
        _id: 1,
        posts: 1,
        accountPrivacy: 1,
        followers: 1,
    });

    if (!user) {
        return next(new ErrorHandler("user not found", 404));
    }

    let currentPage = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    if (user.accountPrivacy === "private") {
        if (user.followers.includes(req.user._id) || req.user._id.toString() === user._id.toString()) {

            await user.populate({
                path: "posts",
                model: "Post",
                select: ["-__v"],
                populate: [
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
                            "accountPrivacy",
                            "accountStatus",
                            "isVerified",
                            "createdAt",
                        ],
                    },
                ],
            });

            let posts = user.posts;
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

            const results = posts.slice(skip, skip + limit);

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
        await user.populate({
            path: "posts",
            model: "Post",
            select: ["-__v"],
            populate: [
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
                        "accountPrivacy",
                        "accountStatus",
                        "isVerified",
                        "createdAt",
                    ],
                },
            ],
        });

        let posts = user.posts;
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

        const results = posts.slice(skip, skip + limit);

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
