import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import ResponseMessages from "../../../../contants/responseMessages.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// SAVE LOGIN INFO ///

const saveLoginInfo = catchAsyncError(async (req, res, next) => {
    let {
        deviceId,
        deviceInfo,
    } = req.body;

    if (!deviceId) {
        return next(new ErrorHandler(ResponseMessages.DEVICE_ID_REQUIRED, 400));
    }

    if (!deviceInfo) {
        return next(new ErrorHandler(ResponseMessages.DEVICE_INFO_REQUIRED, 400));
    }

    if (!deviceInfo.deviceName) {
        return next(new ErrorHandler(ResponseMessages.DEVICE_NAME_REQUIRED, 400));
    }

    if (!deviceInfo.deviceModel) {
        return next(new ErrorHandler(ResponseMessages.DEVICE_MODEL_REQUIRED, 400));
    }

    if (!deviceInfo.deviceBrand) {
        return next(new ErrorHandler(ResponseMessages.DEVICE_BRAND_REQUIRED, 400));
    }

    if (!deviceInfo.deviceManufacturer) {
        return next(new ErrorHandler(ResponseMessages.DEVICE_MANUFACTURER_REQUIRED, 400));
    }

    if (!deviceInfo.deviceOs) {
        return next(new ErrorHandler(ResponseMessages.DEVICE_OS_REQUIRED, 400));
    }

    if (!deviceInfo.deviceOsVersion) {
        return next(new ErrorHandler(ResponseMessages.DEVICE_OS_VERSION_REQUIRED, 400));
    }

    if (!deviceInfo.deviceType) {
        return next(new ErrorHandler(ResponseMessages.DEVICE_TYPE_REQUIRED, 400));
    }

    const ip = utility.getIp(req);

    const locationDetailsFromIp = await utility.getLocationDetailsFromIp(ip);

    const loginInfo = await models.LoginInfo.findOne({
        user: req.user._id,
        deviceId,
    });

    if (loginInfo) {
        loginInfo.ip = ip;
        loginInfo.deviceName = deviceInfo.deviceName;
        loginInfo.deviceModel = deviceInfo.deviceModel;
        loginInfo.deviceBrand = deviceInfo.deviceBrand;
        loginInfo.deviceManufacturer = deviceInfo.deviceManufacturer;
        loginInfo.deviceOs = deviceInfo.deviceOs;
        loginInfo.deviceOsVersion = deviceInfo.deviceOsVersion;
        loginInfo.deviceType = deviceInfo.deviceType;
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

        await loginInfo.save();
    } else {
        await models.LoginInfo.create({
            user: req.user._id,
            deviceId,
            ip,
            deviceName: deviceInfo.deviceName,
            deviceModel: deviceInfo.deviceModel,
            deviceBrand: deviceInfo.deviceBrand,
            deviceManufacturer: deviceInfo.deviceManufacturer,
            deviceOs: deviceInfo.deviceOs,
            deviceOsVersion: deviceInfo.deviceOsVersion,
            deviceType: deviceInfo.deviceType,
            city: locationDetailsFromIp.city,
            region: locationDetailsFromIp.region,
            regionName: locationDetailsFromIp.regionName,
            country: locationDetailsFromIp.country,
            countryCode: locationDetailsFromIp.countryCode,
            continent: locationDetailsFromIp.continent,
            continentCode: locationDetailsFromIp.continentCode,
            lat: locationDetailsFromIp.lat,
            lon: locationDetailsFromIp.lon,
            zip: locationDetailsFromIp.zip,
            timezone: locationDetailsFromIp.timezone,
            currency: locationDetailsFromIp.currency,
            isp: locationDetailsFromIp.isp,
            org: locationDetailsFromIp.org,
            as: locationDetailsFromIp.as,
            asname: locationDetailsFromIp.asname,
            reverse: locationDetailsFromIp.reverse,
        });
    }

    res.status(200).json({
        success: true,
        message: ResponseMessages.LOGIN_INFO_SAVED,
    });
});

export default saveLoginInfo;
