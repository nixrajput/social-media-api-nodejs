import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// GET RECOMMENDED USERS ///

const getRecommendedUsers = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  let currentPage = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 15;

  const users = await models.User.find(
    {
      _id: {
        $nin: [userId],
      },
    },
  ).select("_id").sort({ createdAt: -1 });

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

  const slicedUsers = users.slice(skip, skip + limit);

  const results = [];

  for (let i = 0; i < slicedUsers.length; i++) {
    const user = slicedUsers[i];
    const userData = await models.User.findById(user._id)
      .select([
        "_id", "fname", "lname", "email", "uname", "avatar", "profession",
        "accountPrivacy", "accountStatus", "isVerified", "createdAt",
      ]);

    const followingStatus = await utility.getFollowingStatus(req.user, userData._id);

    results.push({
      _id: userData._id,
      fname: userData.fname,
      lname: userData.lname,
      email: userData.email,
      uname: userData.uname,
      avatar: userData.avatar,
      followingStatus: followingStatus,
      profession: userData.profession,
      accountPrivacy: userData.accountPrivacy,
      accountStatus: userData.accountStatus,
      isVerified: userData.isVerified,
      createdAt: userData.createdAt,
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

export default getRecommendedUsers;
