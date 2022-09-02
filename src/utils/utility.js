import sgMail from "@sendgrid/mail";
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

/// Send Email
utility.sendEmail = async (options) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: options.email, // Change to your recipient
    from: process.env.SMTP_FROM, // Change to your verified sender
    subject: options.subject,
    text: options.message,
    html: options.htmlMessage,
  };

  await sgMail
    .send(msg)
    .then(() => {
      console.log(`Email sent to ${options.email}.`);
    })
    .catch((error) => {
      console.log(error.message);
      console.error(error);
    });
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
