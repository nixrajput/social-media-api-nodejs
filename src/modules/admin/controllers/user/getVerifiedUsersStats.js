import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import models from "../../../../models/index.js";

/// GET VERIFIED USERS STATS -- ADMIN ///

const getVerifiedUsersStats = catchAsyncError(async (req, res, next) => {
    const totalUsers = await models.User.countDocuments();

    const verifiedUsers = await models.User.find({ isVerified: true }).countDocuments();

    const unitVerifiedUsers = verifiedUsers / totalUsers;
    const percentageVerifiedUsers = unitVerifiedUsers * 100;

    const roundedUnitVerifiedUsers = Math.round(unitVerifiedUsers * 100) / 100;
    const roundedPercentage = Math.round(percentageVerifiedUsers * 100) / 100;

    res.status(200).json({
        success: true,
        stats: {
            totalUsers,
            verifiedUsers,
            unit: unitVerifiedUsers,
            percentage: percentageVerifiedUsers,
            roundedUnit: roundedUnitVerifiedUsers,
            roundedPercentage: roundedPercentage,
        }
    });
});

export default getVerifiedUsersStats;
