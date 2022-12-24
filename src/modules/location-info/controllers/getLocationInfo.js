import ResponseMessages from "../../../contants/responseMessages.js";
import catchAsyncError from "../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../helpers/errorHandler.js";
import utility from "../../../utils/utility.js";

/// GET LOCATIONINFO INFO FROM IP ///

const getLocationInfo = catchAsyncError(async (req, res, next) => {
    const ip = req.query.ip || utility.getIp(req);

    const locationDetailsFromIp = await utility.getLocationDetailsFromIp(ip);

    if (!locationDetailsFromIp) {
        return next(new ErrorHandler(ResponseMessages.UNKNOW_ERROR, 404));
    }

    const loginInfo = {};

    loginInfo.ip = ip;
    loginInfo.city = locationDetailsFromIp.city;
    loginInfo.region = locationDetailsFromIp.region;
    loginInfo.regionName = locationDetailsFromIp.regionName;
    loginInfo.country = locationDetailsFromIp.country;
    loginInfo.countryCode = locationDetailsFromIp.countryCode;
    loginInfo.continent = locationDetailsFromIp.continent;
    loginInfo.continentCode = locationDetailsFromIp.continentCode;
    loginInfo.lat = locationDetailsFromIp.lat;
    loginInfo.lon = locationDetailsFromIp.lon;
    loginInfo.zip = locationDetailsFromIp.zip;
    loginInfo.timezone = locationDetailsFromIp.timezone;
    loginInfo.currency = locationDetailsFromIp.currency;
    loginInfo.isp = locationDetailsFromIp.isp;
    loginInfo.org = locationDetailsFromIp.org;
    loginInfo.as = locationDetailsFromIp.as;
    loginInfo.asname = locationDetailsFromIp.asname;
    loginInfo.reverse = locationDetailsFromIp.reverse;

    res.status(200).json({
        success: true,
        data: loginInfo,
    });
});

export default getLocationInfo;