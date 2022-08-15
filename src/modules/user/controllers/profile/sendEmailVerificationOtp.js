import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// SEND EMAIL VERIFICATION OTP ///

const sendEmailVerificationOtp = catchAsyncError(async (req, res, next) => {
  const user = await models.User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
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
      <br><p>Your OTP for email verification is: </p>
      <br><h1>${otp}</h1><br>
      <p>This OTP is valid for only 15 minutes.</p>
      <p>If you have not requested this email then, please ignore it.</p>
      <p>This is a auto-generated email. Please do not reply to this email.</p>
      <p>Regards, <br>
      NixLab Technologies Team</p>`;

  try {
    await utility.sendEmail({
      email: user.email,
      subject: `Verify Your Email`,
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

export default sendEmailVerificationOtp;
