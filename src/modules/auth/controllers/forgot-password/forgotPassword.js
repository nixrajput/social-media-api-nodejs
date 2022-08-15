import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// FORGOT PASSWORD ///

const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(
      new ErrorHandler("please enter your email associated with account", 400)
    );
  }

  const user = await models.User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  const message = await utility.checkUserAccountStatus(user.accountStatus);

  if (message) {
    return next(new ErrorHandler(message, 404));
  }

  // Generating OTP
  const { otp, expiresAt } = await utility.generateOTP();

  const otpObj = await models.OTP.create({
    otp,
    expiresAt,
  });

  user.otp = otpObj._id;

  await user.save();

  const htmlMessage = `<p>Hello ${user.fname},</p>
      <br><p>Your password reset OTP is: </p>
      <br><h1>${otp}</h1><br>
      <p>This OTP is valid for only 15 minutes.</p>
      <p>If you have not requested this email then, please ignore it.</p>
      <p>This is a auto-generated email. Please do not reply to this email.</p>
      <p>Regards, <br>
      NixLab Technologies Team</p>`;

  try {
    await utility.sendEmail({
      email: user.email,
      subject: `OTP for Password Reset`,
      htmlMessage: htmlMessage,
    });

    res.status(200).json({
      success: true,
      message: "otp has been sent successfully",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

export default forgotPassword;
