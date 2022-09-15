import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// UPDATE PROFILE ///

const updateProfile = catchAsyncError(async (req, res, next) => {
  const user = await models.User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
  }

  if (req.body.fname) {
    if (String(req.body.fname).length < 3) {
      return next(
        new ErrorHandler(ResponseMessages.INVALID_FIRST_NAME_LENGTH, 400)
      );
    } else {
      user.fname = req.body.fname;
    }
  }

  if (req.body.lname) {
    if (String(req.body.lname).length < 1) {
      return next(new ErrorHandler(ResponseMessages.INVALID_LAST_NAME_LENGTH, 400));
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

  if (req.body.isPrivate) {
    user.isPrivate = req.body.isPrivate;
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
    message: ResponseMessages.PROFILE_UPDATE_SUCCESS,
  });
});

export default updateProfile;
