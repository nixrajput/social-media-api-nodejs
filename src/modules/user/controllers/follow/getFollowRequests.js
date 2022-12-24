import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// GET FOLLOW REQUESTS ///

const getFollowRequests = catchAsyncError(async (req, res, next) => {
    const userId = req.user._id;

    if (!userId) {
        return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
    }

    let currentPage = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;

    const followRequests = await models.FollowRequest.find({ to: userId })
        .select("_id").sort({ createdAt: -1 });

    let totalRequests = followRequests.length;
    let totalPages = Math.ceil(totalRequests / limit);

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

    const slicedFollowRequests = followRequests.slice(skip, skip + limit);

    const results = [];

    for (let followRequest of slicedFollowRequests) {
        const followRequestData = await utility.getFollowRequestData(followRequest._id, req.user);

        if (followRequestData) {
            results.push(followRequestData);
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
});

export default getFollowRequests;
