import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import models from "../../../../models/index.js";

/// GET RECOMMENDED USERS ///

const getRecommendedUsers = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  let currentPage = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 20;

  const users = await models.User.find(
    {
      _id: {
        $nin: [userId],
      },
    },
    {
      _id: 1,
      fname: 1,
      lname: 1,
      email: 1,
      uname: 1,
      avatar: 1,
      profession: 1,
      accountPrivacy: 1,
      accountStatus: 1,
      isVerified: 1,
      createdAt: 1,
    }
  ).sort({ _id: 1, createdAt: -1 });

  let totalUsers = users.length;
  let totalPages = Math.ceil(totalUsers / limit);

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

  const results = users.slice(skip, skip + limit);

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

export default getRecommendedUsers;
