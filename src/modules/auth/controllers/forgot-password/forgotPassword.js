import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// FORGOT PASSWORD ///

const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("email is required", 400));
  }

  const user = await models.User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("email is incorrect", 404));
  }

  const message = await utility.checkUserAccountStatus(user.accountStatus);

  if (message) {
    return next(new ErrorHandler(message, 400));
  }

  // Generating OTP
  const { otp, expiresAt } = await utility.generateOTP();

  const otpObj = await models.OTP.create({
    otp,
    expiresAt,
  });

  user.otp = otpObj._id;

  await user.save();

  const htmlMessage = `<p>Hi ${user.fname},</p>
  <p>Your OTP for password reset is:</p>
  <h3>${otp}</h3>
  <p>This OTP is valid for 15 minutes & usable once.</p>
  <p>If you have not requested this email then, please ignore it.</p>
  <p>
    For any queries, feel free to contact us at
    <a href="mailto:nixlab.in@gmail.com" target="_blank">nixlab.in@gmail.com</a>.
  </p>
  <p> If you want know more about NixLab, please visit our website 
        <a href="https://www.nixlab.co.in" target="_blank">here</a>.
  </p>
  <p>This is a auto-generated email. Please do not reply to this email.</p>
  <p>
    Regards, <br />
    NixLab Technologies Team
  </p>`;

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
    return next(new ErrorHandler(err.message, 400));
  }
});

export default forgotPassword;
