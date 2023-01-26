import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// @route GET /api/v1/get-comment-replies

const getCommentReplies = catchAsyncError(async (req, res, next) => {
    const commentId = req.query.commentId;

    if (!commentId) {
        return next(new ErrorHandler(ResponseMessages.COMMENT_ID_REQUIRED, 400));
    }

    let currentPage = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;

    const totalCommentReplies = await models.CommentReply
        .countDocuments({
            comment: commentId,
            replyStatus: "active",
        });

    let totalPages = Math.ceil(totalCommentReplies / limit);

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

    const slicedCommentReplies = await models.CommentReply.find({
        comment: commentId,
        replyStatus: "active",
    })
        .select("_id")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const results = [];

    for (let i = 0; i < slicedCommentReplies.length; i++) {
        const replyData = await utility.getCommentReplyData(
            slicedCommentReplies[i]._id, req.user);

        if (replyData) {
            results.push(replyData);
        }
    }

    res.status(200).json({
        success: true,
        message: ResponseMessages.COMMENT_REPLIES_FETCHED,
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

export default getCommentReplies;
