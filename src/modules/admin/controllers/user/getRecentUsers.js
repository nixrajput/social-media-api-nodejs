import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import models from "../../../../models/index.js";

/// GET RECENT USERS  -- ADMIN ///

const getRecentUsers = catchAsyncError(async (req, res, next) => {
    let limit = parseInt(req.query.limit) || 10;

    const results = await models.User.find()
        .select("-__v -password")
        .limit(limit)
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        limit,
        results,
    });
});

export default getRecentUsers;
