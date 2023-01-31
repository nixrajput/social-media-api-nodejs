import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";
import validators from "../../../../utils/validators.js";
import ResponseMessages from "../../../../contants/responseMessages.js";

/// @route  POST /api/v1/register

const register = catchAsyncError(async (req, res, next) => {
  let {
    fname,
    lname,
    email,
    uname,
    password,
    confirmPassword,
  } = req.body;

  if (!fname) {
    return next(new ErrorHandler(ResponseMessages.FIRST_NAME_REQUIRED, 400));
  }

  if (fname && !validators.validateName(fname)) {
    return next(new ErrorHandler(ResponseMessages.INVALID_FIRST_NAME, 400));
  }

  if (!lname) {
    return next(new ErrorHandler(ResponseMessages.LAST_NAME_REQUIRED, 400));
  }

  if (lname && !validators.validateName(lname)) {
    return next(new ErrorHandler(ResponseMessages.INVALID_LAST_NAME, 400));
  }

  if (!email) {
    return next(new ErrorHandler(ResponseMessages.EMAIL_REQUIRED, 400));
  }

  if (email && !validators.validateEmail(email)) {
    return next(new ErrorHandler(ResponseMessages.INVALID_EMAIL, 400));
  }

  if (!uname) {
    return next(new ErrorHandler(ResponseMessages.USERAME_REQUIRED, 400));
  }

  if (uname && !validators.validateUsername(uname)) {
    return next(new ErrorHandler(ResponseMessages.INVALID_USERNAME, 400));
  }

  if (!password) {
    return next(new ErrorHandler(ResponseMessages.PASSWORD_REQUIRED, 400));
  }

  if (!confirmPassword) {
    return next(new ErrorHandler(ResponseMessages.CONFIRM_PASSWORD_REQUIRED, 400));
  }

  const isUsernameAvailable = await utility.checkUsernameAvailable(uname);

  if (!isUsernameAvailable) {
    return next(new ErrorHandler(ResponseMessages.USERAME_NOT_AVAILABLE, 400));
  }

  uname = uname.toLowerCase();

  if (password !== confirmPassword) {
    return next(new ErrorHandler(ResponseMessages.PASSWORDS_DO_NOT_MATCH, 400));
  }

  let isUserExists = await models.User.findOne({ email });

  if (isUserExists) {
    return next(new ErrorHandler(ResponseMessages.ACCOUNT_ALREADY_EXISTS, 400));
  }

  const ip = utility.getIp(req);

  const user = await models.User.create({
    fname,
    lname,
    email,
    uname,
    password,
    accountCreatedIp: ip,
  });

  if (!user) {
    return next(new ErrorHandler(ResponseMessages.ACCOUNT_NOT_CREATED, 500));
  }

  // Generating OTP
  const { otp, expiresAt } = await utility.generateOTP();

  await models.OTP.create({
    otp,
    expiresAt,
    email,
  });

  const htmlMessage = `<p>Hi ${user.fname},</p>
  <p>
    Thank you so much for creating an account with us. We're glad you're here!
  </p>
  <p>
    To learn more about our product and services, visit our website
    <a href="https://www.nixlab.co.in" target="_blank">here</a>.
  </p>
  <p>
    For any queries, feel free to contact us at
    <a href="mailto:nixlab.in@gmail.com" target="_blank">nixlab.in@gmail.com</a>.
  </p>
  <p>This is a auto-generated email. Please do not reply to this email.</p>
  <p>
    Regards, <br />
    NixLab Technologies Team
  </p>`;

  try {
    await utility.sendEmail({
      email: user.email,
      subject: `Welcome to NixLab`,
      htmlMessage: htmlMessage,
    });
  } catch (err) {
    console.log(err.message);
  }

  res.status(201).json({
    success: true,
    message: ResponseMessages.SIGNUP_SUCCESS,
    data: {
      user: user._id,
      otp: otp,
    }
  });
});

export default register;
