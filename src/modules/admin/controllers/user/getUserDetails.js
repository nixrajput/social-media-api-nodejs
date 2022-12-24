import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// GET USER DETAILS -- ADMIN ///

const getUserDetails = catchAsyncError(async (req, res, next) => {
  const userId = req.query.id;

  if (!userId) {
    return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
  }

  const user = await models.User.findOne({ _id: userId })
    .select("-__v");

  if (!user) {
    return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
  }

  res.status(200).json({
    success: true,
    user: user,
  });
});

export default getUserDetails;
