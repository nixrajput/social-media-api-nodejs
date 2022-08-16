import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";
import validators from "../../../../utils/validators.js";

/// REGISTER USER ///

const register = catchAsyncError(async (req, res, next) => {
  let { fname, lname, email, uname, password, confirmPassword } = req.body;

  // Input Validation
  if (!fname) {
    return next(new ErrorHandler("first name is required", 400));
  }

  if (String(fname).length < 3) {
    return next(
      new ErrorHandler("first name must be at least 3 characters", 400)
    );
  }

  if (!lname) {
    return next(new ErrorHandler("last name is required", 400));
  }

  if (!email) {
    return next(new ErrorHandler("email is required", 400));
  }

  if (email && !validators.validateEmail(email)) {
    return next(new ErrorHandler("email is invalid", 400));
  }

  if (!uname) {
    return next(new ErrorHandler("username is required", 400));
  }

  if (String(uname).length < 3) {
    return next(
      new ErrorHandler("username must be at least 3 characters", 400)
    );
  }

  if (String(uname).length > 15) {
    return next(
      new ErrorHandler("username must not exceeds 15 characters", 400)
    );
  }

  if (uname && !validators.validateUsername(uname)) {
    return next(new ErrorHandler("username is invalid", 400));
  }

  if (!password) {
    return next(new ErrorHandler("password is required", 400));
  }

  if (!confirmPassword) {
    return next(new ErrorHandler("confirm password is required", 400));
  }

  if (uname) {
    const isUsernameAvailable = await utility.checkUsernameAvailable(uname);

    if (!isUsernameAvailable) {
      return next(new ErrorHandler("username not available", 400));
    }

    uname = uname.toLowerCase();
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("both passwords do not matched", 400));
  }

  let user = await models.User.findOne({ email });

  if (user) {
    return next(new ErrorHandler("user already exists with this email", 400));
  }

  user = await models.User.create({
    fname,
    lname,
    email,
    uname,
    password,
  });

  // await user.generateToken();
  // await user.save();

  const htmlMessage = `<p>Hello ${user.fname},</p>
      <h2>Welcome to NixLab Technologies.</h2>
      <p>We're glad you're here!</p>
      <p>This is a auto-generated email. Please do not reply to this email.</p>
      <p>Regards, <br>
      NixLab Technologies Team</p>`;

  try {
    await utility.sendEmail({
      email: user.email,
      subject: `Welcome to NixLab Technologies`,
      htmlMessage: htmlMessage,
    });
  } catch (err) {
    console.log(err.message);
  }

  res.status(201).json({
    success: true,
    message: "registered successfully",
  });
});

export default register;
