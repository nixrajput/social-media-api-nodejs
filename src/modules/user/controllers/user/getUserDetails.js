import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// GET USER DETAILS ///

const getUserDetails = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler("please enter user id in query params", 400));
  }

  const user = await models.User.findById(req.query.id)
    .select({
      _id: 1,
      fname: 1,
      lname: 1,
      email: 1,
      uname: 1,
      postsCount: 1,
      followersCount: 1,
      followingCount: 1,
      avatar: 1,
      about: 1,
      dob: 1,
      gender: 1,
      profession: 1,
      website: 1,
      accountPrivacy: 1,
      role: 1,
      accountStatus: 1,
      isVerified: 1,
      createdAt: 1,
    });

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  const followingStatus = await utility.getFollowingStatus(req.user, user._id);

  const userDetails = {};

  userDetails._id = user._id;
  userDetails.fname = user.fname;
  userDetails.lname = user.lname;
  userDetails.email = user.email;
  userDetails.uname = user.uname;
  userDetails.followersCount = user.followersCount;
  userDetails.followingCount = user.followingCount;
  userDetails.postsCount = user.postsCount;
  userDetails.followingStatus = followingStatus;
  userDetails.avatar = user.avatar;
  userDetails.about = user.about;
  userDetails.dob = user.dob;
  userDetails.gender = user.gender;
  userDetails.profession = user.profession;
  userDetails.website = user.website;
  userDetails.accountPrivacy = user.accountPrivacy;
  userDetails.role = user.role;
  userDetails.accountStatus = user.accountStatus;
  userDetails.isVerified = user.isVerified;
  userDetails.createdAt = user.createdAt;

  res.status(200).json({
    success: true,
    user: userDetails,
  });
});

export default getUserDetails;
