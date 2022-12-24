import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import dateUtility from "../../../../utils/dateUtil.js";
import utility from "../../../../utils/utility.js";
import validators from "../../../../utils/validators.js";

/// VERIFY EMAIL ///

const changeEmail = catchAsyncError(async (req, res, next) => {
  const { otp, email } = req.body;

  if (!otp) {
    return next(new ErrorHandler(ResponseMessages.OTP_REQUIRED, 400));
  }

  if (otp.length !== 6) {
    return next(new ErrorHandler(ResponseMessages.INVALID_OTP, 400));
  }

  if (!email) {
    return next(new ErrorHandler(ResponseMessages.EMAIL_REQUIRED, 400));
  }

  if (email && !validators.validateEmail(email)) {
    return next(new ErrorHandler(ResponseMessages.INVALID_EMAIL, 400));
  }

  const otpObj = await models.OTP.findOne({ otp });

  if (!otpObj) {
    return next(new ErrorHandler(ResponseMessages.INCORRECT_OTP, 400));
  }

  if (otpObj.isUsed === true) {
    return next(new ErrorHandler(ResponseMessages.OTP_ALREADY_USED, 400));
  }

  if (dateUtility.compare(otpObj.expiresAt, new Date()) !== 1) {
    return next(new ErrorHandler(ResponseMessages.OTP_EXPIRED, 400));
  }

  const user = await models.User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
  }

  if (otpObj.user.toString() === user._id.toString()) {
    user.email = email;
    user.emailVerified = true;
    user.emailChangedAt = Date.now();

    otpObj.isUsed = true;

    await otpObj.save();
    await user.save();

    const htmlMessage = `<p>Hi ${user.fname},</p>
    <p>Your email has been changed successfully.</p>
    <p>If you did not change your email, please contact us immediately.</p>
  <p>
    If you have any questions, feel free to contact us at
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
        email: email,
        subject: `Email Changed Successfully`,
        htmlMessage: htmlMessage,
      });
    } catch (err) {
      console.log(err);
    }

    res.status(200).json({
      success: true,
      message: ResponseMessages.EMAIL_CHANGE_SUCCESS,
    });

  } else {
    return next(new ErrorHandler(ResponseMessages.INCORRECT_OTP, 400));
  }

});

export default changeEmail;
