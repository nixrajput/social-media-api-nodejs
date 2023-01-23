import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import models from "../../../../models/index.js";

/// @route   GET /api/v1/admin/projects

const getProjects = catchAsyncError(async (req, res, next) => {
    let currentPage = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;

    const totalUsers = await models.Project.countDocuments();

    let totalPages = Math.ceil(totalUsers / limit);

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

    const results = await models.Project.find()
        .select("-__v")
        .populate("owner", [
            "fname", "lname", "uname", "email", "avatar",
            "accountStatus", "isVerified", "verificationRequestedAt",
            "verifiedAt", "role", "createdAt", "updatedAt"
        ])
        .populate("screenshots", "-__v")
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

export default getProjects;
