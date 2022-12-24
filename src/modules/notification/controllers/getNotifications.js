import ResponseMessages from "../../../contants/responseMessages.js";
import catchAsyncError from "../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../helpers/errorHandler.js";
import models from "../../../models/index.js";
import utility from "../../../utils/utility.js";

const getNotifications = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  if (!userId) {
    return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
  }

  let currentPage = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 20;

  const notifications = await models.Notification.find({ to: userId })
    .select("_id").sort({ createdAt: -1 });

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

  const slicedNotifications = notifications.slice(skip, skip + limit);

  const results = [];

  for (let notification of slicedNotifications) {

    const notificationData = await utility.getNotificationData(notification._id, req.user);

    results.push(notificationData);
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

export default getNotifications;
