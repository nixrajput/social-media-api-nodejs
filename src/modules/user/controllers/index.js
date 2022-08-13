import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";
import catchAsyncError from "../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../helpers/errorHandler.js";
import sendEmail from "../../../helpers/sendEmail.js";
import User from "../models/user.js";
import Post from "../../post/models/post.js";
import LoginDetails from "../models/login.js";
import OTP from "../models/otp.js";
import { validateEmail, validateUsername } from "../../../utils/validators.js";
import dates from "../helpers/dateFunc.js";
import generateOTP from "../helpers/generateOTP.js";
import fs from "fs";

// Check Username Availability
export const checkUsernameAvailable = async (uname) => {
  let user = await User.findOne({ uname });

  if (user) {
    return false;
  }

  return true;
};

// Delete All expired OTPs
export const deleteExpiredOTPs = async () => {
  const otps = await OTP.find();

  for (let i = 0; i < otps.length; i++) {
    if (dates.compare(otps[i].expiresAt, new Date()) === -1) {
      await otps[i].remove();
    }
  }

  console.log("[cron] task has deleted expired OTPs.");
};

// Register User
export const register = catchAsyncError(async (req, res, next) => {
  let { fname, lname, email, uname, password, confirmPassword } = req.body;

  // Input Validation
  if (!fname) {
    return next(new ErrorHandler("Please enter your first name.", 400));
  }

  if (String(fname).length < 3) {
    return next(
      new ErrorHandler("First name must be at least 3 characters.", 400)
    );
  }

  if (!lname) {
    return next(new ErrorHandler("Please enter your last name.", 400));
  }

  if (!email) {
    return next(new ErrorHandler("Please enter your email.", 400));
  }

  if (email && !validateEmail(email)) {
    return next(new ErrorHandler("Please enter a valid email address.", 400));
  }

  if (!uname) {
    return next(new ErrorHandler("Please enter an username.", 400));
  }

  if (String(uname).length < 3) {
    return next(
      new ErrorHandler("Username must be at least 3 characters.", 400)
    );
  }

  if (String(uname).length > 20) {
    return next(
      new ErrorHandler("Username must not exceeds 20 characters", 400)
    );
  }

  if (uname && !validateUsername(uname)) {
    return next(new ErrorHandler("Please enter a valid username.", 400));
  }

  if (!password) {
    return next(new ErrorHandler("Please enter a password.", 400));
  }

  if (!confirmPassword) {
    return next(new ErrorHandler("Please enter the password again.", 400));
  }

  if (uname) {
    const isUsernameAvailable = await checkUsernameAvailable(uname);

    if (!isUsernameAvailable) {
      return next(new ErrorHandler("Username not available.", 400));
    }

    uname = uname.toLowerCase();
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Both passwords do not matched.", 400));
  }

  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler("User already exists with this email.", 400));
  }

  user = await User.create({
    fname,
    lname,
    email,
    uname,
    password,
  });

  await user.generateToken();
  await user.save();

  const htmlMessage = `<p>Hello ${user.fname},</p>
    <h2>Welcome to NixLab Technologies.</h2>
    <p>We're glad you're here!</p>
    <p>This is a auto-generated email. Please do not reply to this email.</p>
    <p>Regards, <br>
    NixLab Technologies Team</p>`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Welcome to NixLab Technologies`,
      htmlMessage: htmlMessage,
    });
  } catch (err) {
    console.log(err.message);
  }

  res.status(201).json({
    success: true,
    message: "User registered.",
  });
});

// Login User
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return next(new ErrorHandler("Please enter your email.", 400));
  }

  if (email && !validateEmail(email)) {
    return next(new ErrorHandler("Please enter a valid email address.", 400));
  }

  if (!password) {
    return next(new ErrorHandler("Please enter your password.", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  const isPasswordMatched = await user.matchPassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect password.", 400));
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
    message: "User logged in.",
    token: token,
    expiresAt: expiresAt,
  });
});

// Logout User
export const logout = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  user.token = undefined;
  user.expiresAt = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "User logged out.",
  });
});

// Get Profile Details
export const getProfileDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate({
    path: "posts",
    model: "Post",
    populate: [
      {
        path: "owner",
        model: "User",
        select: [
          "_id",
          "fname",
          "lname",
          "email",
          "uname",
          "avatar",
          "profession",
          "accountType",
          "accountStatus",
          "isVerified",
        ],
      },
    ],
    options: {
      sort: { createdAt: -1 },
    },
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Follow User
export const followUser = catchAsyncError(async (req, res, next) => {
  const userToFollow = await User.findById(req.query.id);
  const user = await User.findById(req.user._id);

  if (!userToFollow) {
    return next(new ErrorHandler("User not found.", 404));
  }

  if (user.following.includes(userToFollow._id)) {
    const indexFollowing = user.following.indexOf(userToFollow._id);
    user.following.splice(indexFollowing, 1);

    const indexFollower = userToFollow.followers.indexOf(user._id);
    userToFollow.followers.splice(indexFollower, 1);

    await user.save();
    await userToFollow.save();

    res.status(200).json({
      success: true,
      message: "User unfollowed.",
    });
  } else {
    user.following.push(userToFollow._id);
    userToFollow.followers.push(user._id);

    await user.save();
    await userToFollow.save();

    res.status(200).json({
      success: true,
      message: "User followed.",
    });
  }
});

// Update Password
export const changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword) {
    return next(new ErrorHandler("Please enter old password.", 400));
  }

  if (!newPassword) {
    return next(new ErrorHandler("Please enter new password.", 400));
  }

  if (!confirmPassword) {
    return next(new ErrorHandler("Please enter confirm password.", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("New passwords do not matched.", 400));
  }

  const user = await User.findById(req.user._id).select("+password");

  const isPasswordMatched = await user.matchPassword(oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect.", 400));
  }

  user.password = newPassword;

  await user.generateToken();
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated.",
  });
});

// Forgot Password
export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(
      new ErrorHandler("Please enter your email associated with account.", 400)
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User does not exist.", 404));
  }

  // Generating OTP
  const { otp, expiresAt } = await generateOTP();

  const otpObj = await OTP.create({
    otp,
    expiresAt,
  });

  user.otp = otpObj._id;

  await user.save();

  const htmlMessage = `<p>Hello ${user.fname},</p>
    <br><p>Your password reset OTP is: </p>
    <br><h1>${otp}</h1><br>
    <p>This OTP is valid for only 15 minutes.</p>
    <p>If you have not requested this email then, please ignore it.</p>
    <p>This is a auto-generated email. Please do not reply to this email.</p>
    <p>Regards, <br>
    NixLab Technologies Team</p>`;

  try {
    await sendEmail({
      email: user.email,
      subject: `OTP for Password Reset`,
      htmlMessage: htmlMessage,
    });

    res.status(200).json({
      success: true,
      message: "OTP has been sent to your email address.",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

// Reset Password
export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { otp, newPassword, confirmPassword } = req.body;

  if (!otp) {
    return next(new ErrorHandler("Please enter OTP.", 400));
  }

  if (!newPassword) {
    return next(new ErrorHandler("Please enter new password.", 400));
  }

  if (!confirmPassword) {
    return next(new ErrorHandler("Please enter confirm password.", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("Both Passwords do not matched.", 400));
  }

  const otpObj = await OTP.findOne({ otp });

  if (!otpObj) {
    return next(new ErrorHandler("OTP is invalid.", 401));
  }

  if (otpObj.isVerified === true) {
    return next(new ErrorHandler("OTP is already used.", 401));
  }

  if (dates.compare(otpObj.expiresAt, new Date()) === 1) {
    const user = await User.findOne({
      otp: otpObj._id,
    });

    if (!user) {
      return next(new ErrorHandler("OTP is invalid or expired.", 401));
    }

    user.password = newPassword;
    user.otp = undefined;
    otpObj.isVerified = true;

    await user.generateToken();
    await otpObj.save();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated.",
    });
  } else {
    return next(new ErrorHandler("OTP is expired.", 401));
  }
});

// Upload User Avatar
export const uploadAvatar = catchAsyncError(async (req, res, next) => {
  const avatar = req.file;

  if (!avatar) {
    return next(new ErrorHandler("Please provide an avatar image.", 400));
  }

  const fileSize = avatar.size / 1024;

  if (fileSize > 2048) {
    return next(new ErrorHandler("Image size must be lower than 2mb.", 413));
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  const fileTempPath = avatar.path;

  if (fileTempPath) {
    if (user.avatar && user.avatar.public_id) {
      const imageId = user.avatar.public_id;
      await cloudinary.v2.uploader.destroy(imageId);
    }

    await cloudinary.v2.uploader
      .upload(fileTempPath, {
        folder: "social_media_api/avatars",
      })
      .then(async (result) => {
        user.avatar = {
          public_id: result.public_id,
          url: result.secure_url,
        };

        await user.save();

        fs.unlink(fileTempPath, (err) => {
          if (err) console.log(err);
        });

        res.status(200).json({
          success: true,
          message: "Profile picture updated.",
        });
      })
      .catch((err) => {
        fs.unlink(fileTempPath, (fileErr) => {
          if (fileErr) console.log(fileErr);
        });

        console.log(err);

        res.status(400).json({
          success: false,
          message: "An error occurred in uploading image to server.",
        });
      });
  } else {
    res.status(400).json({
      success: false,
      message: "Image path is invalid.",
    });
  }
});

// Update User Profile
export const updateUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  if (req.body.fname) {
    if (String(req.body.fname).length < 3) {
      return next(
        new ErrorHandler("First name must be at least 3 characters.", 400)
      );
    } else {
      user.fname = req.body.fname;
    }
  }

  if (req.body.lname) {
    if (String(req.body.lname).length < 1) {
      return next(new ErrorHandler("Last name can't be empty.", 400));
    } else {
      user.lname = req.body.lname;
    }
  }

  // if (req.body.phone) {
  //     const phoneRegExp = /^\d{10}$/;
  //     if (!String(req.body.phone.phoneNo).match(phoneRegExp)) {
  //         return next(new ErrorHandler("Enter a valid phone number.", 400));
  //     }

  //     user.phone = req.body.phone;
  // }

  if (req.body.gender) {
    user.gender = req.body.gender;
  }

  if (req.body.dob) {
    user.dob = req.body.dob;
  }

  if (req.body.about) {
    user.about = req.body.about;
  }

  if (req.body.profession) {
    user.profession = req.body.profession;
  }

  if (req.body.accountType) {
    user.accountType = req.body.accountType;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile details updated.",
  });
});

// Send Verification Email
export const sendVerificationEmail = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User does not exist.", 404));
  }

  // Generating OTP
  const { otp, expiresAt } = await generateOTP();

  const otpObj = await OTP.create({
    otp,
    expiresAt,
  });

  user.otp = otpObj._id;

  await user.save();

  const htmlMessage = `<p>Hello ${user.fname},</p>
    <br><p>Your OTP for verification is: </p>
    <br><h1>${otp}</h1><br>
    <p>This OTP is valid for only 15 minutes.</p>
    <p>If you have not requested this email then, please ignore it.</p>
    <p>This is a auto-generated email. Please do not reply to this email.</p>
    <p>Regards, <br>
    NixLab Technologies Team</p>`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Verify Your Account`,
      htmlMessage: htmlMessage,
    });

    res.status(200).json({
      success: true,
      message: "OTP has been sent to your email address.",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

// Verify Account
export const verifyAccount = catchAsyncError(async (req, res, next) => {
  const { otp } = req.body;

  if (!otp) {
    return next(new ErrorHandler("Please enter OTP.", 400));
  }

  const otpObj = await OTP.findOne({ otp });

  if (!otpObj) {
    return next(new ErrorHandler("OTP is invalid.", 401));
  }

  if (otpObj.isVerified === true) {
    return next(new ErrorHandler("OTP is already used.", 401));
  }

  if (dates.compare(otpObj.expiresAt, new Date()) === 1) {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new ErrorHandler("User does not exist.", 404));
    }

    if (otpObj._id.toString() === user.otp.toString()) {
      if (user.emailVerified === false) {
        user.emailVerified = true;
        user.otp = undefined;
        otpObj.isVerified = true;

        await otpObj.save();
        await user.save();

        res.status(200).json({
          success: true,
          message: "User account verified.",
        });
      }

      user.otp = undefined;
      otpObj.isVerified = true;

      await otpObj.save();
      await user.save();

      res.status(200).json({
        success: true,
        message: "Already verified.",
      });
    } else {
      return next(new ErrorHandler("OTP is invalid or expired.", 401));
    }
  } else {
    return next(new ErrorHandler("OTP is expired.", 401));
  }
});

// Check Username Availabilty
export const checkUsernameAvailability = catchAsyncError(
  async (req, res, next) => {
    const { uname } = req.body;

    if (!uname) {
      return next(new ErrorHandler("Please enter an username.", 400));
    }

    if (uname && !validateUsername(uname)) {
      return next(new ErrorHandler("Please enter a valid username.", 400));
    }

    const isUsernameAvailable = await checkUsernameAvailable(
      uname.toLowerCase()
    );

    if (isUsernameAvailable) {
      res.status(200).json({
        success: true,
        message: "Username available.",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Username not available.",
      });
    }
  }
);

// Update Username
export const changeUsername = catchAsyncError(async (req, res, next) => {
  const { uname } = req.body;

  if (!uname) {
    return next(new ErrorHandler("Please enter an username.", 400));
  }

  if (uname && !validateUsername(uname)) {
    return next(new ErrorHandler("Please enter a valid username.", 400));
  }

  const isUsernameAvailable = await checkUsernameAvailable(uname);

  if (isUsernameAvailable) {
    const user = await User.findById(req.user._id);

    if (uname) {
      user.uname = uname.toLowerCase();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Username updated.",
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Username couldn't updated.",
    });
  }
});

// Delete User Profile
export const deleteProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const posts = user.posts;
  const followers = user.followers;
  const followings = user.following;
  const userId = user._id;

  await user.remove();

  for (let i = 0; i < posts.length; i++) {
    const post = await Post.findById(posts[i]);
    post.remove();
  }

  for (let i = 0; i < followers.length; i++) {
    const follower = await User.findById(followers[i]);

    const index = follower.following.indexOf(userId);

    follower.following.splice(index, 1);

    await follower.save();
  }

  for (let i = 0; i < followings.length; i++) {
    const following = await User.findById(followings[i]);

    const index = following.followers.indexOf(userId);

    following.followers.splice(index, 1);

    await following.save();
  }

  res.status(200).json({
    success: true,
    message: "User profile deleted.",
  });
});

// Get User Details
export const getUserProfileDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.query.id).populate({
    path: "posts",
    model: "Post",
    populate: [
      {
        path: "owner",
        model: "User",
        select: [
          "_id",
          "fname",
          "lname",
          "email",
          "uname",
          "avatar",
          "profession",
          "accountType",
          "accountStatus",
          "isVerified",
        ],
      },
    ],
    options: {
      sort: { createdAt: -1 },
    },
  });

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      uname: user.uname,
      posts: user.posts,
      followers: user.followers,
      following: user.following,
      avatar: user.avatar,
      about: user.about,
      dob: user.dob,
      gender: user.gender,
      profession: user.profession,
      accountType: user.accountType,
      role: user.role,
      accountStatus: user.accountStatus,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
  });
});

// Get Following User List
export const getFollowingUserList = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.query.id).populate([
    {
      path: "following",
      select: [
        "_id",
        "fname",
        "lname",
        "email",
        "uname",
        "avatar",
        "profession",
        "accountType",
        "accountStatus",
        "isVerified",
      ],
      options: {
        sort: { uname: 1 },
      },
    },
  ]);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  res.status(200).json({
    success: true,
    count: user.following.length,
    results: user.following,
  });
});

// Get Followers User List
export const getFollowersUserList = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.query.id).populate([
    {
      path: "followers",
      select: [
        "_id",
        "fname",
        "lname",
        "email",
        "uname",
        "avatar",
        "profession",
        "accountType",
        "accountStatus",
        "isVerified",
      ],
      options: {
        sort: { uname: 1 },
      },
    },
  ]);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  res.status(200).json({
    success: true,
    count: user.followers.length,
    results: user.followers,
  });
});

// Search User
export const searchUser = catchAsyncError(async (req, res, next) => {
  const searchText = req.query.text;
  const users = await User.find(
    {
      $or: [
        {
          uname: new RegExp(searchText, "gi"),
        },
        {
          fname: new RegExp(searchText, "gi"),
        },
        {
          lname: new RegExp(searchText, "gi"),
        },
      ],
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
  );

  res.status(200).json({
    success: true,
    results: users,
  });
});

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

// Update User Role -- Admin
export const updateUserRole = catchAsyncError(async (req, res, next) => {
  const { role } = req.body;

  if (!role) {
    return next(new ErrorHandler("Please enter a role.", 400));
  }

  const user = User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  user.role = String(role).toLowerCase();

  await user.save();

  res.status(200).json({
    success: true,
    message: "User role updated.",
  });
});

// Update Account Status -- Admin
export const updateAccountStatus = catchAsyncError(async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return next(new ErrorHandler("Please enter a status.", 400));
  }

  const user = User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  user.accountStatus = String(status).toLowerCase();

  await user.save();

  res.status(200).json({
    success: true,
    message: "Account status updated.",
  });
});

// Delete User -- Admin
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User deleted.",
  });
});
