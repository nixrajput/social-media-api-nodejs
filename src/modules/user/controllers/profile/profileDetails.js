import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import models from "../../../../models/index.js";

/// GET PROFILE DETAILS

const getProfileDetails = catchAsyncError(async (req, res, next) => {
  const user = await models.User.findById(req.user._id)
    .select([
      "_id", "fname", "lname", "email", "uname", "avatar",
      "dob", "gender", "about", "profession", "website", "location",
      "postsCount", "followersCount", "followingCount", "isValid",
      "accountPrivacy", "accountStatus", "isVerified", "verificationStatus",
      "role", "createdAt",
    ]);

  const profileDetails = {};

  profileDetails._id = user._id;
  profileDetails.fname = user.fname;
  profileDetails.lname = user.lname;
  profileDetails.email = user.email;
  profileDetails.uname = user.uname;
  profileDetails.avatar = user.avatar;
  profileDetails.dob = user.dob;
  profileDetails.gender = user.gender;
  profileDetails.about = user.about;
  profileDetails.profession = user.profession;
  profileDetails.website = user.website;
  profileDetails.location = user.location;
  profileDetails.postsCount = user.postsCount;
  profileDetails.followersCount = user.followersCount;
  profileDetails.followingCount = user.followingCount;
  profileDetails.isValid = user.isValid;
  profileDetails.accountPrivacy = user.accountPrivacy;
  profileDetails.accountStatus = user.accountStatus;
  profileDetails.isVerified = user.isVerified;
  profileDetails.verificationStatus = user.verificationStatus;
  profileDetails.role = user.role;
  profileDetails.createdAt = user.createdAt;

  res.status(200).json({
    success: true,
    user: profileDetails,
  });
});

export default getProfileDetails;
