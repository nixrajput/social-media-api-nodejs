import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

const getFollowers = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler("please enter user id in query params", 400));
  }

  const user = await models.User.findById(req.query.id).select("followers");

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  await user.populate([
    {
      path: "followers",
      select: [
        "_id",
        "fname",
        "lname",
        "email",
        "uname",
        "avatar",
        "profession",
        "accountType",
        "accountStatus",
        "isVerified",
      ],
      options: {
        sort: { uname: 1 },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    count: user.followers.length,
    results: user.followers,
  });
});

export default getFollowers;
