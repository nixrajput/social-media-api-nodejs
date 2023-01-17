import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// @route GET /api/v1/get-post-details

const getPostDetails = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
  }

  const post = await models.Post.findOne({
    _id: req.query.id,
    postStatus: "active",
  })
    .select("_id");

  if (!post) {
    return next(new ErrorHandler(ResponseMessages.POST_NOT_FOUND, 404));
  }

  const postDetails = await utility.getPostData(post._id, req.user);

  res.status(200).json({
    success: true,
    post: postDetails,
  });
});

export default getPostDetails;
