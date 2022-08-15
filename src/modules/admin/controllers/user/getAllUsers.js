import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import models from "../../../../models/index.js";

/// GET ALL USERS  -- ADMIN ///

const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await models.User.find();

  res.status(200).json({
    success: true,
    count: users.length,
    results: users,
  });
});

export default getAllUsers;
