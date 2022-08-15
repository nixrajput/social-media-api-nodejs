import jwt from "jsonwebtoken";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import validators from "../../../../utils/validators.js";
import utility from "../../../../utils/utility.js";

/// LOGIN USER ///

const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return next(new ErrorHandler("please enter your email", 400));
  }

  if (email && !validators.validateEmail(email)) {
    return next(new ErrorHandler("please enter a valid email address", 400));
  }

  if (!password) {
    return next(new ErrorHandler("please enter your password", 400));
  }

  const user = await models.User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  const isPasswordMatched = await user.matchPassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("incorrect password", 400));
  }

  const message = await utility.checkUserAccountStatus(user.accountStatus);

  if (message) {
    return next(new ErrorHandler(message, 404));
  }

  let token = user.token;
  let expiresAt = user.expiresAt;

  if (token && expiresAt) {
    if (expiresAt < new Date().getTime() / 1000) {
      token = await user.generateToken();
      await user.save();
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      expiresAt = decodedData.exp;
    }
  } else {
    token = await user.generateToken();
    await user.save();
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    expiresAt = decodedData.exp;
  }

  res.status(200).json({
    success: true,
    message: "logged in successfully",
    token: token,
    expiresAt: expiresAt,
  });
});

export default login;
