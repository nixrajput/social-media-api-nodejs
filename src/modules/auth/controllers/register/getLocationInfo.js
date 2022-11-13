import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import utility from "../../../../utils/utility.js";

const getLocationInfoFromIp = catchAsyncError(async (req, res, next) => {
    const ip = utility.getIp(req);

    const locationInfo = await utility.getLocationDetailsFromIp(ip);

    res.status(201).json({
        success: true,
        ip,
        locationInfo,
    });
});

export default getLocationInfoFromIp;
