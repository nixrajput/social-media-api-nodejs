import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import models from "../../../../models/index.js";

/// GET LOGIN HISTORY INFO ///

const getLoginHistory = catchAsyncError(async (req, res, next) => {
    let currentPage = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;

    const totalLoginInfos = await models.LoginInfo.find({ user: req.user._id })
        .countDocuments();

    let totalPages = Math.ceil(totalLoginInfos / limit);

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

    const results = await models.LoginInfo.find({ user: req.user._id })
        .select("-__v")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

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

export default getLoginHistory;
