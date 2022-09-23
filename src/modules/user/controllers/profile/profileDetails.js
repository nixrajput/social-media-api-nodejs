import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import models from "../../../../models/index.js";

/// GET PROFILE DETAILS

const getProfileDetails = catchAsyncError(async (req, res, next) => {
  const user = await models.User.findById(req.user._id)
    .select([
      "_id", "fname", "lname", "email", "uname", "avatar",
      "dob", "gender", "about", "profession", "website", "location",
      "postsCount", "followersCount", "followingCount", "isValid",
      "isPrivate", "accountStatus", "isVerified", "verificationStatus",
      "role", "createdAt", "emailVerified", "phone", "countryCode",
      "phoneVerified", "updatedAt", "publicKeys",
    ]);

  const profileDetails = {};

  profileDetails._id = user._id;
  profileDetails.fname = user.fname;
  profileDetails.lname = user.lname;
  profileDetails.email = user.email;
  profileDetails.emailVerified = user.emailVerified;
  profileDetails.uname = user.uname;
  profileDetails.avatar = user.avatar;
  profileDetails.phone = user.phone;
  profileDetails.countryCode = user.countryCode;
  profileDetails.phoneVerified = user.phoneVerified;
  profileDetails.dob = user.dob;
  profileDetails.gender = user.gender;
  profileDetails.about = user.about;
  profileDetails.profession = user.profession;
  profileDetails.website = user.website;
  profileDetails.location = user.location;
  profileDetails.postsCount = user.postsCount;
  profileDetails.followersCount = user.followersCount;
  profileDetails.followingCount = user.followingCount;
  profileDetails.accountStatus = user.accountStatus;
  profileDetails.isPrivate = user.isPrivate;
  profileDetails.isValid = user.isValid;
  profileDetails.isVerified = user.isVerified;
  profileDetails.verificationStatus = user.verificationStatus;
  profileDetails.role = user.role;
  profileDetails.publicKeys = user.publicKeys;
  profileDetails.createdAt = user.createdAt;
  profileDetails.updatedAt = user.updatedAt;

  res.status(200).json({
    success: true,
    user: profileDetails,
  });
});

export default getProfileDetails;
