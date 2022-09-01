import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// UPDATE ACCOUNT STATUS ///

const updateAccountStatus = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler("please enter user id in query params", 400));
  }

  const user = await models.User.findById(req.query.id);

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  const { status } = req.body;

  if (!status) {
    return next(
      new ErrorHandler(
        "please enter a vaid status ['active', 'inactive', 'deactivated', 'suspended', 'blocked', 'deleted', 'banned', 'reported', 'pending', 'withheld', 'restricted']",
        400
      )
    );
  }

  user.accountStatus = String(status).toLowerCase();

  await user.save();

  res.status(200).json({
    success: true,
    message: "account status updated successfully",
    accountStatus: user.accountStatus,
  });
});

export default updateAccountStatus;
