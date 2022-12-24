import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import validators from "../../../../utils/validators.js";

/// UPDATE PROFILE ///

const updateProfile = catchAsyncError(async (req, res, next) => {
  const user = await models.User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
  }

  if (req.body.fname) {
    if (!validators.validateName(req.body.fname)) {
      return next(new ErrorHandler(ResponseMessages.INVALID_FIRST_NAME_LENGTH, 400));
    }

    user.fname = req.body.fname;
    user.nameChangedAt = Date.now();
  }

  if (req.body.lname) {
    if (!validators.validateName(req.body.lname)) {
      return next(new ErrorHandler(ResponseMessages.INVALID_LAST_NAME_LENGTH, 400));
    }

    user.lname = req.body.lname;
    user.nameChangedAt = Date.now();
  }

  if (req.body.gender) {
    user.gender = req.body.gender;
  }

  if (req.body.dob) {
    user.dob = req.body.dob;
  }

  if (req.body.about) {
    if (!validators.validateAbout(req.body.about)) {
      return next(new ErrorHandler(ResponseMessages.INVALID_ABOUT_LENGTH, 400));
    }

    user.about = req.body.about;
  }

  if (req.body.profession) {
    user.profession = req.body.profession;
  }

  if (req.body.isPrivate) {
    user.isPrivate = req.body.isPrivate;
  }

  if (req.body.website) {
    if (!validators.validateUrl(req.body.website)) {
      return next(new ErrorHandler(ResponseMessages.INVALID_URL, 400));
    }
    user.website = req.body.website;
  }

  if (req.body.location) {
    user.location = req.body.location;
  }

  if (req.body.showOnlineStatus) {
    user.showOnlineStatus = req.body.showOnlineStatus;
  }

  if (req.body.showLastSeen) {
    user.showLastSeen = req.body.showLastSeen;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: ResponseMessages.PROFILE_UPDATE_SUCCESS,
  });
});

export default updateProfile;
