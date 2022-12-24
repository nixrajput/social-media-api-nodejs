import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import models from "../../../../models/index.js";

/// DELETE PROFILE ///

const deleteProfile = catchAsyncError(async (req, res, next) => {
  const user = await models.User.findById(req.user._id);

  user.accountStatus = "deleted";

  await user.save();

  res.status(200).json({
    success: true,
    message: "profile delete request sent",
  });
});

export default deleteProfile;
