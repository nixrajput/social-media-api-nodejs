import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// SEARCH FOLLOWERS ///

const searchFollowers = catchAsyncError(async (req, res, next) => {
    if (!req.query.id || !req.query.q) {
        return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
    }

    const searchText = req.query.q;

    const followers = await models.Follower.find({ user: req.query.id })
        .select("_id").sort({ createdAt: -1 });

    let currentPage = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;

    let totalFollowers = followers.length;
    let totalPages = Math.ceil(totalFollowers / limit);

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

    const slicedFollowers = followers.slice(skip, skip + limit);

    let results = [];

    for (let follower of slicedFollowers) {
        const followerData = await utility.getFollowerData(follower._id, req.user);

        if (followerData) {
            results.push(followerData);
        }
    }

    results = results.filter((result) => {
        return (
            result.user.uname.toLowerCase().includes(searchText.toLowerCase()) ||
            result.user.fname.toLowerCase().includes(searchText.toLowerCase())
        );
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

export default searchFollowers;
