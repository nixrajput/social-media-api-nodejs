import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// GET RECOMMENDED USERS ///

const getRecommendedUsers = catchAsyncError(async (req, res, next) => {

  let currentPage = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 20;

  let totalUsers = await models.User.countDocuments({
    _id: {
      $nin: [req.user._id],
    },
    accountStatus: "active",
    isValid: true,
  });

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

  const slicedUsers = await models.User.find(
    {
      _id: {
        $nin: [req.user._id],
      },
      accountStatus: "active",
      isValid: true,
    },
  )
    .select("_id")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const results = [];

  for (let i = 0; i < slicedUsers.length; i++) {
    const userData = await utility.getUserData(slicedUsers[i]._id, req.user);

    results.push(userData);
  }

  res.status(200).json({
    success: true,
    message: ResponseMessages.USER_DETAILS_FETCHED,
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

export default getRecommendedUsers;
