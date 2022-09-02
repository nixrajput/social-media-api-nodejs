import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// GET FOLLOW REQUESTS ///

const getFollowRequests = catchAsyncError(async (req, res, next) => {
    const userId = req.user._id;

    if (!userId) {
        return next(new ErrorHandler("user not found", 404));
    }

    let currentPage = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    const notifications = await models.Notification
        .find({
            owner: userId,
            type: "followRequest",
        })
        .sort({ createdAt: -1 });

    const notificationResults = [];

    for (let i = 0; i < notifications.length; i++) {
        const notification = notifications[i];

        const ownerData = await utility.getOwnerData(notification.owner, req.user);
        const userData = await utility.getOwnerData(notification.user, req.user);

        const notificationData = {};
        notificationData._id = notification._id;
        notificationData.owner = ownerData;
        notificationData.user = userData;
        notificationData.refId = notification.refId;
        notificationData.body = notification.body;
        notificationData.type = notification.type;
        notificationData.isRead = notification.isRead;
        notificationData.createdAt = notification.createdAt;

        notificationResults.push(notificationData);
    }

    let totalNotifications = notifications.length;
    let totalPages = Math.ceil(totalNotifications / limit);

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

    const results = notificationResults.slice(skip, skip + limit);

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
