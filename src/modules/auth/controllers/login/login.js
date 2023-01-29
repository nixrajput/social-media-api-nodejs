import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import validators from "../../../../utils/validators.js";
import ResponseMessages from "../../../../contants/responseMessages.js";
import utility from "../../../../utils/utility.js";

/// @route  POST /api/v1/login

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
      return next(new ErrorHandler(ResponseMessages.INCORRECT_EMAIL_OR_USERNAME, 400));
    }
  }
  else {
    user = await models.User.findOne({ uname: emailUname }).select("+password");

    if (!user) {
      return next(new ErrorHandler(ResponseMessages.INCORRECT_EMAIL_OR_USERNAME, 400));
    }
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorHandler(ResponseMessages.INCORRECT_PASSWORD, 400));
  }

  if (!user.isValid) {
    return res.status(401).json({
      success: false,
      accountStatus: "unverified",
      message: ResponseMessages.INVALID_ACCOUNT_VALIDATION,
    });
  }

  if (user.accountStatus !== "active") {
    return res.status(401).json({
      success: false,
      accountStatus: user.accountStatus,
      message: ResponseMessages.ACCOUNT_NOT_ACTIVE,
    });
  }

  const authToken = await models.AuthToken.findOne({ user: user._id });

  if (!authToken) {
    const tokenObj = await utility.generateAuthToken(user);

    return res.status(200).json({
      success: true,
      message: ResponseMessages.LOGIN_SUCCESS,
      accountStatus: user.accountStatus,
      token: tokenObj.token,
      expiresAt: tokenObj.expiresAt,
    });
  }

  let token = authToken.token;
  let expiresAt = authToken.expiresAt;

  if (expiresAt < new Date().getTime() / 1000) {
    await authToken.remove();
    const tokenObj = await utility.generateAuthToken(user);

    token = tokenObj.token;
    expiresAt = tokenObj.expiresAt;
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
