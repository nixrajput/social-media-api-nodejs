import jwt from "jsonwebtoken";
import ErrorHandler from "../helpers/errorHandler.js";
import catchAsyncError from "../helpers/catchAsyncError.js";
import models from "../models/index.js";
import ResponseMessages from "../contants/responseMessages.js";

const authMiddleware = {};

authMiddleware.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return next(new ErrorHandler(ResponseMessages.AUTH_PARAM_REQUIRED, 400));
  }

  const authorizationHeader = authorization.split(" ");
  const token = authorizationHeader[1];

  if (!token) {
    return next(new ErrorHandler(ResponseMessages.AUTH_TOKEN_REQUIRED, 400));
  }

  try {
    /// decodedData is an object that will be used to store 
    /// the decoded data from the token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    // console.log(decodedData);

    const authToken = await models.AuthToken.findOne({
      token: token,
      user: decodedData.id
    });

    if (!authToken) {
      return next(new ErrorHandler(ResponseMessages.INVALID_EXPIRED_TOKEN, 400));
    }

    const user = await models.User.findById(decodedData.id);

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
        accountStatus: req.user.accountStatus,
        message: ResponseMessages.ACCOUNT_NOT_ACTIVE,
      });
    }

    req.user = user;

    next();
  }
  catch (err) {

    console.log(err);

    return res.status(401).json({
      success: false,
      message: ResponseMessages.INVALID_EXPIRED_TOKEN,
    });
  }

});

// AUthorize Roles
authMiddleware.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const { role } = req.user;
    let authorizedRoles = roles;

    if (typeof roles === "string") {
      authorizedRoles = roles.split(",");
    }

    if (!authorizedRoles.includes(role)) {
      return next(new ErrorHandler('Access Denied!', 403));
    }

    next();
  };
};

export default authMiddleware;
