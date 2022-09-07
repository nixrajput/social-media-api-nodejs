import sgMail from "@sendgrid/mail";
import twilio from "twilio";
import optGenerator from "otp-generator";
import models from "../models/index.js";
import dates from "./dateFunc.js";
import ResponseMessages from "../contants/responseMessages.js";

const utility = {};

// Check Username Availability
utility.checkUsernameAvailable = async (uname) => {
  let user = await models.User.findOne({ uname });

  if (user) {
    return false;
  }

  return true;
};

// Delete All expired OTPs
utility.deleteExpiredOTPs = async () => {
  const otps = await models.OTP.find();

  for (let i = 0; i < otps.length; i++) {
    if (dates.compare(otps[i].expiresAt, new Date()) === -1) {
      await otps[i].remove();
    }
  }

  console.log("[cron] task has deleted expired OTPs.");
};


/// SEND SMS USING TWILIO
utility.sendSMS = async (options) => {

  if (!options.phone || options.phone === "") {
    return Error(ResponseMessages.PHONE_REQUIRED);
  }

  if (!options.message || options.message === "") {
    return Error(ResponseMessages.MESSAGE_REQUIRED);
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  const { phone, message } = options;

  await client.messages.create({
    to: phone,
    from: process.env.TWILIO_PHONE_NO,
    body: message,
  });
};


/// SEND SMS USING TWILIO - SENDGRID
utility.sendEmail = async (options) => {
  if (!options.email || options.email === "") {
    throw Error(ResponseMessages.EMAIL_REQUIRED);
  }

  /// Set API Key
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  let msg = {};

  if (options.htmlMessage) {
    msg = {
      to: options.email,
      from: process.env.SMTP_FROM,
      subject: options.subject,
      html: options.htmlMessage,
    };
  }
  else {
    msg = {
      to: options.email,
      from: process.env.SMTP_FROM,
      subject: options.subject,
      text: options.message,
    };
  }

  try {
    console.log("Sending Email...");
    await sgMail.send(msg);
    console.log(`${ResponseMessages.EMAIL_SEND_SUCCESS}: ${options.email}`);
  }
  catch (err) {
    throw Error(err.message)
  }
};

/// Generate OTP
utility.generateOTP = async (size = 6, expireTimeInMin = 15) => {
  const options = {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  };

  // Generating Token
  const otp = optGenerator.generate(size, options);

  // Valid for 15 minutes
  const expiresAt = Date.now() + expireTimeInMin * 60 * 1000;

  return { otp, expiresAt };
};

/// Check if Email is Already Used
utility.checkEmailAvailable = async (email) => {
  let user = await models.User.findOne({ email });

  if (user) {
    return false;
  }

  return true;
};

/// Check if Phone is Already Used
utility.checkPhoneAvailable = async (phone) => {
  let user = await models.User.findOne({ phone });

  if (user) {
    return false;
  }

  return true;
};

/// Check Account Status
utility.checkUserAccountStatus = async (status) => {
  if (status === "deleted") {
    return ResponseMessages.ACCOUNT_DELETED;
  }

  if (status === "suspended") {
    return ResponseMessages.ACCOUNT_SUSPENDED;
  }

  if (status === "deactivated") {
    return ResponseMessages.ACCOUNT_DEACTIVATED;
  }
};

utility.checkUserAccountType = async (type) => {
  if (type === "superadmin") {
    return ResponseMessages.ACCOUNT_SUPERADMIN;
  }
  if (type === "admin") {
    return ResponseMessages.ACCOUNT_ADMIN;
  }

  if (type === "moderator") {
    return ResponseMessages.ACCOUNT_MODERATOR;
  }

  if (type === "user") {
    return ResponseMessages.ACCOUNT_USER;
  }
};

utility.getFollowingStatus = async (user, followId) => {

  const isSameUser = await utility.checkIfSameUser(user, followId);

  if (isSameUser) {
    return "self";
  }

  const isFollowing = user.following.find(
    (following) => following.user.toString() === followId.toString()
  );

  if (isFollowing) return "following";

  const followRequest = await models.Notification.findOne({
    user: user._id,
    owner: followId,
    type: "followRequest",
  });

  if (followRequest) return "requested";

  return "notFollowing";
}

utility.checkIfSameUser = async (user, userId) => {
  if (user._id.toString() === userId.toString()) {
    return true;
  }

  return false;
};

utility.checkIfPostOwner = async (postId, user) => {
  const post = await models.Post.findById(postId).select("owner");

  if (post.owner.toString() === user._id.toString()) {
    return true;
  }

  return false;
};

utility.checkIfPostLiked = async (postId, user) => {
  const post = await models.Post.findById(postId).select("likes");
  const isLiked = post.likes.find(
    (like) => like.likedBy.toString() === user._id.toString()
  );

  if (isLiked) {
    return true;
  }

  return false;
};

utility.getOwnerData = async (ownerId, reqUser) => {
  const owner = await models.User.findById(ownerId)
    .select([
      "_id", "fname", "lname", "email", "uname", "avatar", "profession",
      "accountPrivacy", "accountStatus", "isVerified", "createdAt",
    ]);
  const ownerData = {};

  const followingStatus = await utility.getFollowingStatus(reqUser, owner._id);

  ownerData._id = owner._id;
  ownerData.fname = owner.fname;
  ownerData.lname = owner.lname;
  ownerData.email = owner.email;
  ownerData.uname = owner.uname;
  ownerData.avatar = owner.avatar;
  ownerData.profession = owner.profession;
  ownerData.accountPrivacy = owner.accountPrivacy;
  ownerData.accountStatus = owner.accountStatus;
  ownerData.isVerified = owner.isVerified;
  ownerData.createdAt = owner.createdAt;
  ownerData.followingStatus = followingStatus;

  return ownerData;
};

export default utility;
