import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import sendEmail from "../../../helpers/sendEmail.js";
import User from "../models/user.js";
import Post from "../../../helpers/post.js";
import LoginDetails from "../../../../models/auth/deviceInfo.js";
import OTP from "../models/otp.js";
import {
  validateEmail,
  validateUsername,
} from "../../../../utils/validators.js";
import dates from "../../../../utils/dateFunc.js";
import generateOTP from "../helpers/generateOTP.js";

// Get Random 10 Users
export const getRandomUsers = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  const users = await User.find(
    {
      _id: {
        $nin: [userId],
      },
    },
    {
      _id: 1,
      fname: 1,
      lname: 1,
      email: 1,
      uname: 1,
      avatar: 1,
      profession: 1,
      accountType: 1,
      accountStatus: 1,
      isVerified: 1,
    }
  ).limit(50);

  res.status(200).json({
    success: true,
    results: users,
  });
});

// Save Login Info
export const saveLoginInfo = catchAsyncError(async (req, res, next) => {
  const { deviceInfo, locationInfo, lastActive } = req.body;

  const user = req.user._id;

  const device = {
    deviceInfo: deviceInfo,
    locationInfo: locationInfo,
    lastActive: lastActive,
  };

  let loginDetails;

  loginDetails = await LoginDetails.findOne({ user: user });

  if (!loginDetails) {
    loginDetails = await LoginDetails.create({
      user: user,
    });

    loginDetails.devices.push(device);

    await loginDetails.save();

    res.status(200).json({
      success: true,
      message: "Login details saved.",
    });
  } else {
    if (loginDetails.devices.length > 0) {
      const tempDev = loginDetails.devices.find(
        (item) => item.deviceInfo.deviceId == deviceInfo.deviceId
      );

      if (tempDev) {
        tempDev.locationInfo = locationInfo;
        tempDev.lastActive = lastActive;
      } else {
        loginDetails.devices.push(device);
      }
    }

    await loginDetails.save();

    res.status(200).json({
      success: true,
      message: "Login details saved.",
    });
  }
});

// Get Login Info
export const getLoginInfo = catchAsyncError(async (req, res, next) => {
  const user = req.user._id;

  const loginDetails = await LoginDetails.findOne({ user: user });

  res.status(200).json({
    success: true,
    result: loginDetails,
  });
});

// Get All Users -- Admin
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    count: users.length,
    results: users,
  });
});
