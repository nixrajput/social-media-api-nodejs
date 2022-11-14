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

// {
//     "status": "success",
//     "continent": "Asia",
//     "continentCode": "AS",
//     "country": "India",
//     "countryCode": "IN",
//     "region": "BR",
//     "regionName": "Bihar",
//     "city": "Patna",
//     "zip": "800001",
//     "lat": 25.5908,
//     "lon": 85.1348,
//     "timezone": "Asia/Kolkata",
//     "currency": "INR",
//     "isp": "Reliance Jio Infocomm Limited",
//     "org": "Rjil Internet",
//     "as": "AS55836 Reliance Jio Infocomm Limited",
//     "asname": "RELIANCEJIO-IN",
//     "reverse": "",
//     "mobile": true,
//     "proxy": false,
//     "hosting": false,
//     "query": "157.35.83.208"
//   }
