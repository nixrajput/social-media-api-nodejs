import catchAsyncError from "../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../helpers/errorHandler.js";
import models from "../../../models/index.js";
import ResponseMessages from "../../../contants/responseMessages.js";
import utility from "../../../utils/utility.js";

/// SEARCH TAG ///

const searchTag = catchAsyncError(async (req, res, next) => {
    if (!req.query.q) {
        return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
    }

    const searchText = req.query.q;

    const tags = await models.Tag.find({ name: new RegExp(searchText, "gi") })
        .select("_id").sort({ postsCount: -1 });

    let currentPage = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    let totalTags = tags.length;
    let totalPages = Math.ceil(totalTags / limit);

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

    const slicedTags = tags.slice(skip, skip + limit);

    const results = [];

    for (let tag of slicedTags) {
        const tagData = await utility.getHashTagData(tag._id);

        if (tagData) {
            results.push(tagData);
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

export default searchTag;
