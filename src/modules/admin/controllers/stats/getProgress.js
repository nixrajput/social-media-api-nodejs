import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import models from "../../../../models/index.js";

/// GET PROGRESS  -- ADMIN ///

const getProgress = catchAsyncError(async (req, res, next) => {
    const stats = {};

    /// Users Stats
    const totalUsers = await models.User.countDocuments();

    const date = new Date();
    const firstDayPrevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    const lastDayPrevMonth = new Date(date.getFullYear(), date.getMonth(), 0);
    const firstDayPrevPrevMonth = new Date(date.getFullYear(), date.getMonth() - 2, 1);
    const lastDayPrevPrevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 0);

    const usersInLastMonth = await models.User.countDocuments({
        createdAt: {
            $gte: firstDayPrevMonth,
            $lte: lastDayPrevMonth,
        },
    });

    const usersInSecondLastMonth = await models.User.countDocuments({
        createdAt: {
            $gte: firstDayPrevPrevMonth,
            $lte: lastDayPrevPrevMonth,
        },
    });

    const progress = Math.round(
        ((usersInLastMonth - usersInSecondLastMonth) / usersInSecondLastMonth) * 100
    );

    const users = {
        total: totalUsers,
        lastMonth: usersInLastMonth,
        secondLastMonth: usersInSecondLastMonth,
        progress: progress,
    };

    stats.users = users;

    /// Post Stats
    const totalPosts = await models.Post.countDocuments();

    const postsInLastMonth = await models.Post.countDocuments({
        createdAt: {
            $gte: firstDayPrevMonth,
            $lte: lastDayPrevMonth,
        },
    });

    const postsInSecondLastMonth = await models.Post.countDocuments({
        createdAt: {
            $gte: firstDayPrevPrevMonth,
            $lte: lastDayPrevPrevMonth,
        },
    });

    const postProgress = Math.round(
        ((postsInLastMonth - postsInSecondLastMonth) / postsInSecondLastMonth) * 100
    );

    const posts = {
        total: totalPosts,
        lastMonth: postsInLastMonth,
        secondLastMonth: postsInSecondLastMonth,
        progress: postProgress,
    };

    stats.posts = posts;

    /// Comment Stats
    const totalComments = await models.Comment.countDocuments();

    const commentsInLastMonth = await models.Comment.countDocuments({
        createdAt: {
            $gte: firstDayPrevMonth,
            $lte: lastDayPrevMonth,
        },
    });

    const commentsInSecondLastMonth = await models.Comment.countDocuments({
        createdAt: {
            $gte: firstDayPrevPrevMonth,
            $lte: lastDayPrevPrevMonth,
        },
    });

    const commentProgress = Math.round(
        ((commentsInLastMonth - commentsInSecondLastMonth) / commentsInSecondLastMonth) * 100
    );

    const comments = {
        total: totalComments,
        lastMonth: commentsInLastMonth,
        secondLastMonth: commentsInSecondLastMonth,
        progress: commentProgress,
    };

    stats.comments = comments;

    /// Message Stats
    const totalMessages = await models.ChatMessage.countDocuments();

    const messagesInLastMonth = await models.ChatMessage.countDocuments({
        createdAt: {
            $gte: firstDayPrevMonth,
            $lte: lastDayPrevMonth,
        },
    });

    const messagesInSecondLastMonth = await models.ChatMessage.countDocuments({
        createdAt: {
            $gte: firstDayPrevPrevMonth,
            $lte: lastDayPrevPrevMonth,
        },
    });

    const messageProgress = Math.round(
        ((messagesInLastMonth - messagesInSecondLastMonth) / messagesInSecondLastMonth) * 100
    );

    const messages = {
        total: totalMessages,
        lastMonth: messagesInLastMonth,
        secondLastMonth: messagesInSecondLastMonth,
        progress: messageProgress,
    };

    stats.messages = messages;

    res.status(200).json({
        success: true,
        progressTillDate: lastDayPrevMonth.toLocaleDateString(),
        stats,
    });
});

export default getProgress;
