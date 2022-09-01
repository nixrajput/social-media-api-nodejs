import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// UPDATE USER ROLE ///

const updateUserRole = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler("please enter user id in query params", 400));
  }

  const user = await models.User.findById(req.query.id);

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  const { role } = req.body;

  if (!role) {
    return next(
      new ErrorHandler("please enter a vaid role ['user', 'admin', 'superadmin', 'moderator']", 400)
    );
  }

  user.role = String(role).toLowerCase();

  await user.save();

  res.status(200).json({
    success: true,
    message: "user role updated successfully",
    role: user.role,
  });
});

export default updateUserRole;
