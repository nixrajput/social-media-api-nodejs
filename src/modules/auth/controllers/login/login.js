import jwt from "jsonwebtoken";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import validators from "../../../../utils/validators.js";
import ResponseMessages from "../../../../contants/responseMessages.js";

/// LOGIN USER ///

const login = catchAsyncError(async (req, res, next) => {
  const { emailUname, password } = req.body;

  if (!emailUname) {
    return next(new ErrorHandler(ResponseMessages.EMAIL_USERNAME_REQUIRED, 400));
  }

  if (!password) {
    return next(new ErrorHandler(ResponseMessages.PASSWORD_REQUIRED, 400));
  }

  let user;

  if (emailUname && validators.validateEmail(emailUname)) {
    user = await models.User.findOne({ email: emailUname }).select("+password");
    if (!user) {
      return next(new ErrorHandler(ResponseMessages.INCORRECT_EMAIL, 400));
    }
  }
  else {
    user = await models.User.findOne({ uname: emailUname }).select("+password");

    if (!user) {
      return next(new ErrorHandler(ResponseMessages.INCORRECT_USERNAME, 400));
    }
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorHandler(ResponseMessages.INCORRECT_PASSWORD, 400));
  }

  if (!user.isValid) {
    return next(new ErrorHandler(ResponseMessages.INVALID_ACCOUNT_VALIDATION, 400));
  }

  if (user.accountStatus !== "active") {
    return res.status(401).json({
      success: false,
      accountStatus: user.accountStatus,
      message: ResponseMessages.ACCOUNT_NOT_ACTIVE,
    });
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
    message: ResponseMessages.LOGIN_SUCCESS,
    accountStatus: user.accountStatus,
    token: token,
    expiresAt: expiresAt,
  });
});

export default login;
