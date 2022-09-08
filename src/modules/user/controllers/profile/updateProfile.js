import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// UPDATE PROFILE ///

const updateProfile = catchAsyncError(async (req, res, next) => {
  const user = await models.User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  if (req.body.fname) {
    if (String(req.body.fname).length < 3) {
      return next(
        new ErrorHandler("first name must be at least 3 characters", 400)
      );
    } else {
      user.fname = req.body.fname;
    }
  }

  if (req.body.lname) {
    if (String(req.body.lname).length < 1) {
      return next(new ErrorHandler("last name can't be empty", 400));
    } else {
      user.lname = req.body.lname;
    }
  }

  if (req.body.gender) {
    user.gender = req.body.gender;
  }

  if (req.body.dob) {
    user.dob = req.body.dob;
  }

  if (req.body.about) {
    user.about = req.body.about;
  }

  if (req.body.profession) {
    user.profession = req.body.profession;
  }

  if (req.body.accountPrivacy) {
    user.accountPrivacy = req.body.accountPrivacy;
  }

  if (req.body.website) {
    user.website = req.body.website;
  }

  if (req.body.location) {
    user.location = req.body.location;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "profile has been updated successfully",
  });
});

export default updateProfile;
