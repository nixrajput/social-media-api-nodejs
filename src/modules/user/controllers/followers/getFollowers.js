import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

const getFollowers = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler("please enter user id in query params", 400));
  }

  const user = await models.User.findById(req.query.id)
    .select("followers followersCount");

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  let currentPage = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;

  let totalFollowers = user.followersCount;
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

  const slicedFollowers = user.followers.slice(skip, skip + limit);

  const results = [];

  for (let i = 0; i < slicedFollowers.length; i++) {
    const follower = slicedFollowers[i];
    const followerData = await models.User.findById(follower.user)
      .select([
        "_id", "fname", "lname", "email", "uname", "avatar", "profession",
        "accountPrivacy", "accountStatus", "isVerified", "createdAt",
      ]);

    const followingStatus = await utility.getFollowingStatus(req.user, followerData._id);

    results.push({
      user: {
        _id: followerData._id,
        fname: followerData.fname,
        lname: followerData.lname,
        email: followerData.email,
        uname: followerData.uname,
        avatar: followerData.avatar,
        followingStatus: followingStatus,
        profession: followerData.profession,
        accountPrivacy: followerData.accountPrivacy,
        accountStatus: followerData.accountStatus,
        isVerified: followerData.isVerified,
        createdAt: followerData.createdAt,
      },
      createdAt: follower.createdAt,
    });
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

export default getFollowers;
