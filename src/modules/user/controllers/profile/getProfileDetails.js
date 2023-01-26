import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import utility from "../../../../utils/utility.js";
import ResponseMessages from "../../../../contants/responseMessages.js";

/// @route GET /api/v1/me

const getProfileDetails = catchAsyncError(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
  }

  const profileDetails = await utility.getProfileData(req.user);

  res.status(200).json({
    success: true,
    message: ResponseMessages.USER_PROFILE_DETAILS_FETCHED,
    user: profileDetails,
  });
});

export default getProfileDetails;
