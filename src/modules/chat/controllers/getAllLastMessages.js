import mongoose from "mongoose";
import ResponseMessages from "../../../contants/responseMessages.js";
import catchAsyncError from "../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../helpers/errorHandler.js";
import models from "../../../models/index.js";
import utility from "../../../utils/utility.js";

const getAllLastMessages = catchAsyncError(async (req, res, next) => {
    const receiverId = req.user._id;

    if (!receiverId) {
        return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
    }

    let currentPage = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 25;

    let totalMessages = await models.ChatMessage.aggregate([
        {
            $match: {
                $or: [
                    { "sender": mongoose.Types.ObjectId(`${receiverId}`) },
                    { "receiver": mongoose.Types.ObjectId(`${receiverId}`) },
                ]
            }
        },
        { $sort: { createdAt: -1 } },
        {
            $group: {
                "_id": { $setUnion: [["$sender", "$receiver"]] },
                "message": { $first: "$$ROOT" }
            }
        },
    ]).exec();

    let totalPages = Math.ceil(totalMessages.length / limit);

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

    const sortedMessages = totalMessages.sort((a, b) => {
        return new Date(b.message.createdAt) - new Date(a.message.createdAt);
    });

    const filteredMessages = sortedMessages.slice(skip, skip + limit);

    const results = await Promise.all(
        filteredMessages.map(async (message) => {
            return await utility.getChatData(message.message._id);
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

export default getAllLastMessages;
