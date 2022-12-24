import ResponseMessages from "../../../contants/responseMessages.js";
import catchAsyncError from "../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../helpers/errorHandler.js";
import models from "../../../models/index.js";
import utility from "../../../utils/utility.js";

const getMessagesById = catchAsyncError(async (req, res, next) => {
    const loggedInUserId = req.user._id;
    const userId = req.query.id;

    if (!loggedInUserId || !userId) {
        return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
    }

    if (loggedInUserId.toString() === userId.toString()) {
        return next(new ErrorHandler(ResponseMessages.INVALID_USER, 400));
    }

    let currentPage = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 25;

    let totalMessagesCount = await models.ChatMessage.countDocuments({
        $or: [
            { $and: [{ sender: userId }, { receiver: loggedInUserId }] },
            { $and: [{ sender: loggedInUserId }, { receiver: userId }] },
        ],
    });

    let totalPages = Math.ceil(totalMessagesCount / limit);

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    if (currentPage < 1) {
        currentPage = 1;
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

    const messages = await models.ChatMessage.find({
        $or: [
            { $and: [{ sender: userId }, { receiver: loggedInUserId }] },
            { $and: [{ sender: loggedInUserId }, { receiver: userId }] },
        ],
    }).select("_id").sort({ createdAt: -1 })
        .skip(skip).limit(limit);

    const results = await Promise.all(
        messages.map(async (message) => {
            return await utility.getChatData(message._id);
        })
    );

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

export default getMessagesById;
