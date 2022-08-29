import jwt from "jsonwebtoken";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import validators from "../../../../utils/validators.js";
import utility from "../../../../utils/utility.js";

/// LOGIN USER ///

const login = catchAsyncError(async (req, res, next) => {
  const { emailUname, password } = req.body;

  if (!emailUname) {
    return next(new ErrorHandler("email or username is required", 400));
  }

  if (!password) {
    return next(new ErrorHandler("password is required", 400));
  }

  let user;

  if (emailUname && validators.validateEmail(emailUname)) {
    user = await models.User.findOne({ email: emailUname }).select("+password");
    if (!user) {
      return next(new ErrorHandler("email is incorrect", 400));
    }
  }
  else {
    user = await models.User.findOne({ uname: emailUname }).select("+password");

    if (!user) {
      return next(new ErrorHandler("username is incorrect", 400));
    }
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorHandler("password is incorrect", 400));
  }

  // if (!user.isValid) {
  //   return next(new ErrorHandler("account is not verified", 400));
  // }

  const message = await utility.checkUserAccountStatus(user.accountStatus);

  if (message) {
    return next(new ErrorHandler(message, 400));
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
