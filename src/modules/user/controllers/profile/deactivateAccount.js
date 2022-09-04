import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import models from "../../../../models/index.js";

/// DEACTIVATED PROFILE ///

const deactivateAccount = catchAsyncError(async (req, res, next) => {
    const user = await models.User.findById(req.user._id);

    user.accountStatus = "deactivated";

    await user.save();

    res.status(200).json({
        success: true,
        message: "Account deactivated successfully",
    });
});

export default deactivateAccount;
