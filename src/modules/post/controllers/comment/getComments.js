import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// GET COMMENTS ///

const getComments = catchAsyncError(async (req, res, next) => {
  if (!req.query.postId) {
    return next(new ErrorHandler("please enter post id in query params", 400));
  }

  let currentPage = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;

  const comments = await models.Comment.find({ post: req.query.postId })
    .sort({
      createdAt: -1,
    });

  let totalComments = comments.length;
  let totalPages = Math.ceil(totalComments / limit);

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

  const slicedComments = comments.slice(skip, skip + limit);

  const results = [];

  for (let i = 0; i < slicedComments.length; i++) {
    const comment = slicedComments[i];

    const ownerData = await utility.getOwnerData(comment.user, req.user);

    const commentData = {};
    commentData._id = comment._id;
    commentData.comment = comment.comment;
    commentData.post = comment.post;
    commentData.user = ownerData;
    commentData.likesCount = comment.likesCount;
    commentData.commentStatus = comment.commentStatus;
    commentData.createdAt = comment.createdAt;

    results.push(commentData);
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

export default getComments;
