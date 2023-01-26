import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// @route GET /api/v1/user-details

const getUserDetails = catchAsyncError(async (req, res, next) => {

  let searchQuery;

  if (!req.query.id && !req.query.username) {
    return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
  }

  if (req.query.id && req.query.username) {
    return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
  }

  if (req.query.id) {
    searchQuery = { _id: req.query.id };
  }

  if (req.query.username) {
    searchQuery = { uname: req.query.username };
  }

  const user = await models.User.findOne(searchQuery).select("_id");

  if (!user) {
    return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
  }

  const userDetails = await utility.getUserProfileData(user._id, req.user);

  // const userDetails = {};

  // userDetails._id = user._id;
  // userDetails.fname = user.fname;
  // userDetails.lname = user.lname;
  // userDetails.email = user.email;
  // userDetails.uname = user.uname;
  // userDetails.followersCount = user.followersCount;
  // userDetails.followingCount = user.followingCount;
  // userDetails.postsCount = user.postsCount;
  // userDetails.followingStatus = followingStatus;
  // userDetails.avatar = user.avatar;
  // userDetails.about = user.about;
  // userDetails.dob = user.dob;
  // userDetails.gender = user.gender;
  // userDetails.profession = user.profession;
  // userDetails.website = user.website;
  // userDetails.accountStatus = user.accountStatus;
  // userDetails.isPrivate = user.isPrivate;
  // userDetails.isValid = user.isValid;
  // userDetails.isVerified = user.isVerified;
  // userDetails.verifiedCategory = user.verifiedCategory;
  // userDetails.role = user.role;
  // userDetails.createdAt = user.createdAt;
  // userDetails.updatedAt = user.updatedAt;

  res.status(200).json({
    success: true,
    message: ResponseMessages.USER_DETAILS_FETCHED,
    user: userDetails,
  });
});

export default getUserDetails;
