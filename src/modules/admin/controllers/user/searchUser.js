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
      __v: 0,
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
