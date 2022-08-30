import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

const getFollowers = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler("please enter user id in query params", 400));
  }

  const user = await models.User.findById(req.query.id).select("followers");

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  const followers = user.followers;

  let currentPage = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 5;

  let totalFollowers = followers.length;
  let totalPages = Math.ceil(totalFollowers / limit);

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

  const followerData = followers.slice(skip, skip + limit);

  const results = await models.User.find({ _id: { $in: followerData } })
    .select({
      _id: 1,
      fname: 1,
      lname: 1,
      email: 1,
      uname: 1,
      avatar: 1,
      profession: 1,
      accountType: 1,
      accountStatus: 1,
      isVerified: 1,
      createdAt: 1,
    }).sort({ uname: 1 });

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

export default getFollowers;
