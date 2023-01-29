import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

const getBlockedUsers = catchAsyncError(async (req, res, next) => {
    let userId = req.user._id;

    if (req.query.id) {
        userId = req.query.id;
    }

    let currentPage = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;

    const totalBlockedUsers = await models.BlockedUser.countDocuments({
        user: userId,
    });

    let totalPages = Math.ceil(totalBlockedUsers / limit);

    if (totalPages <= 0) {
        totalPages = 1;
    }

    if (currentPage <= 1) {
        currentPage = 1;
    }

    if (totalPages > 1 && currentPage > totalPages) {
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

    const slicedBlockedUsers = await models.BlockedUser.find({
        user: userId,
    })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const results = [];

    for (let user of slicedBlockedUsers) {
        const userData = await utility.getUserData(user.blockedUser, req.user);

        if (userData) {
            results.push(userData);
        }
    }

    res.status(200).json({
        success: true,
        message: ResponseMessages.BLOCKED_USERS_FETCHED,
        currentPage,
        totalPages,
        limit,
        hasPrevPage,
        prevPage,
        hasNextPage,
        nextPage,
        length: results.length,
        results,
    });
});

export default getBlockedUsers;
