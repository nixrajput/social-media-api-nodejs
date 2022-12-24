import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";
import validators from "../../../../utils/validators.js";

/// SEND ADD/CHANGE PHONE OTP ///

const addChangePhoneOtp = catchAsyncError(async (req, res, next) => {
  const { phone, countryCode } = req.body;

  if (!phone) {
    return next(new ErrorHandler(ResponseMessages.PHONE_REQUIRED, 400));
  }

  if (!countryCode) {
    return next(new ErrorHandler(ResponseMessages.COUNTRY_CODE_REQUIRED, 400));
  }

  const phoneNo = countryCode + phone;

  if ((phone && countryCode) && !validators.validatePhone(phoneNo)) {
    return next(new ErrorHandler(ResponseMessages.INVALID_PHONE, 400));
  }

  const user = await models.User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
  }

  // Generating OTP
  const { otp, expiresAt } = await utility.generateOTP();

  await models.OTP.create({
    otp,
    expiresAt,
    user: user._id,
  });

  try {
    await utility.sendSMS({
      phone: phoneNo,
      message: `Your OTP is ${otp}`,
    });

    res.status(200).json({
      success: true,
      message: ResponseMessages.OTP_SEND_SUCCESS,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

export default addChangePhoneOtp;
