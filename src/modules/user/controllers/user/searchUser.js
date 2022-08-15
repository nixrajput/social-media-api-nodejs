import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// SEARCH USER ///

const searchUser = catchAsyncError(async (req, res, next) => {
  if (!req.query.q) {
    return next(new ErrorHandler("please provide a search query", 400));
  }

  const searchText = req.query.q;

  const users = await models.User.find(
    {
      $or: [
        {
          uname: new RegExp(searchText, "gi"),
        },
        {
          fname: new RegExp(searchText, "gi"),
        },
        {
          lname: new RegExp(searchText, "gi"),
        },
      ],
    },
    {
      _id: 1,
      fname: 1,
      lname: 1,
      email: 1,
      uname: 1,
      avatar: 1,
      profession: 1,
      accountType: 1,
      accountStatus: 1,
      isVerified: 1,
      createdAt: 1,
    }
  );

  if (users.length <= 0) {
    return next(new ErrorHandler("no user found", 404));
  }

  res.status(200).json({
    success: true,
    count: users.length,
    results: users,
  });
});

export default searchUser;
