import catchAsyncError from "../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../helpers/errorHandler.js";
import models from "../../../models/index.js";
import ResponseMessages from "../../../contants/responseMessages.js";
import utility from "../../../utils/utility.js";

/// SEARCH TAG ///

const getPostsByTag = catchAsyncError(async (req, res, next) => {
    if (!req.query.q) {
        return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
    }

    const searchText = req.query.q;

    const tag = await models.Tag.findOne({ name: new RegExp(searchText, "gi") })
        .select("_id postsCount");

    let currentPage = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    let totalPosts = tag.postsCount;
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

    const slicedPosts = tag.posts.slice(skip, skip + limit);

    const results = [];

    for (let postId of slicedPosts) {
        const postData = await utility.getPostData(postId, req.user);

        if (postData) {
            results.push(postData);
        }
    }

    results.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

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

export default getPostsByTag;
