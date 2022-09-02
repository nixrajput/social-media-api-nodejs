import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// GET POSTS ///

const getPosts = catchAsyncError(async (req, res, next) => {
  const user = await models.User.findById(req.user._id)
    .select("_id following");

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  let currentPage = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;

  const followingIds = user.following.map((follow) => follow.user);

  const posts = await models.Post.find({
    owner: {
      $in: [...followingIds, user._id],
    },
  }).sort({
    createdAt: -1,
  });

  const postsResults = [];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    const ownerData = await utility.getOwnerData(post.owner, req.user);

    const isLiked = await utility.checkIfPostLiked(post._id, req.user);

    const postData = {};
    postData._id = post._id;
    postData.caption = post.caption;
    postData.mediaFiles = post.mediaFiles;
    postData.owner = ownerData;
    postData.likesCount = post.likesCount;
    postData.commentsCount = post.commentsCount;
    postData.isLiked = isLiked;
    postData.postStatus = post.postStatus;
    postData.createdAt = post.createdAt;

    postsResults.push(postData);
  }

  let totalPosts = posts.length;
  let totalPages = Math.ceil(totalPosts / limit);

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

  const results = postsResults.slice(skip, skip + limit);

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

export default getPosts;
