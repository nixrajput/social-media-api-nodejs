import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import models from "../../../../models/index.js";

/// GET PROFILE DETAILS

const getProfileDetails = catchAsyncError(async (req, res, next) => {
  const user = await models.User.findById(req.user._id)
    .select("-__v")
    .populate({
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
    user,
  });
});

export default getProfileDetails;
