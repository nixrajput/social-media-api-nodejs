import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// GET POST DETAILS ///

const getPostDetails = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler("please enter post id in query params", 400));
  }

  const post = await models.Post.findById(req.query.id).select("-__v");

  if (!post) {
    return next(new ErrorHandler("post not found", 404));
  }

  await post.populate([
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
        "accountPrivacy",
        "accountStatus",
        "isVerified",
      ],
    },
    {
      path: "comments",
      model: "Comment",
      select: ["_id", "comment", "user", "post", "likes", "createdAt"],
      populate: [
        {
          path: "user",
          model: "User",
          select: [
            "_id",
            "fname",
            "lname",
            "email",
            "uname",
            "avatar",
            "profession",
            "accountPrivacy",
            "accountStatus",
            "isVerified",
          ],
        },
      ],
      options: {
        sort: {
          createdAt: -1,
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    post,
  });
});

export default getPostDetails;
