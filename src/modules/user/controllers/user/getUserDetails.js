import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// GET USER DETAILS ///

const getUserDetails = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler("please enter user id in query params", 400));
  }

  const user = await models.User.findById(req.query.id).select({
    _id: 1,
    fname: 1,
    lname: 1,
    email: 1,
    uname: 1,
    posts: 1,
    followers: 1,
    following: 1,
    avatar: 1,
    about: 1,
    dob: 1,
    gender: 1,
    profession: 1,
    accountType: 1,
    role: 1,
    accountStatus: 1,
    isVerified: 1,
    createdAt: 1,
  });

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  user.populate({
    path: "posts",
    model: "Post",
    populate: [
      {
        path: "owner",
        model: "User",
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
      },
    ],
    options: {
      sort: { createdAt: -1 },
    },
  });

  res.status(200).json({
    success: true,
    user: user,
  });
});

export default getUserDetails;
