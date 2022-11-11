import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import models from "../../../../models/index.js";

/// GET PROGRESS  -- ADMIN ///

const getStats = catchAsyncError(async (req, res, next) => {
    const stats = {};

    /// Users Stats
    const totalUsers = await models.User.countDocuments();

    const users = {
        total: totalUsers,
    };

    stats.users = users;

    /// Post Stats
    const totalPosts = await models.Post.countDocuments();

    const posts = {
        total: totalPosts,
    };

    stats.posts = posts;

    /// Comment Stats
    const totalComments = await models.Comment.countDocuments();

    const comments = {
        total: totalComments,
    };

    stats.comments = comments;

    /// Message Stats
    const totalMessages = await models.ChatMessage.countDocuments();

    const messages = {
        total: totalMessages,
    };

    stats.messages = messages;

    res.status(200).json({
        success: true,
        timestamp: new Date().toLocaleDateString(),
        stats,
    });
});

export default getStats;
