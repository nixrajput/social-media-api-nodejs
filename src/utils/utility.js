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

utility.getFollowingStatus = async (reqUser, followUser) => {

  const isSameUser = await utility.checkIfSameUser(reqUser, followUser);

  if (isSameUser) {
    return "self";
  }

  const isFollowing = reqUser.following.find(
    (following) => following.user.toString() === followUser.toString()
  );

  if (isFollowing) return "following";

  const followRequest = await models.Notification.findOne({
    user: reqUser._id,
    owner: followUser,
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

utility.getUserData = async (userId, reqUser) => {
  const user = await models.User.findById(userId)
    .select([
      "_id", "fname", "lname", "email", "uname", "avatar", "profession",
      "accountPrivacy", "accountStatus", "isVerified", "createdAt",
    ]);
  const userData = {};

  const followingStatus = await utility.getFollowingStatus(reqUser, user._id);

  userData._id = user._id;
  userData.fname = user.fname;
  userData.lname = user.lname;
  userData.email = user.email;
  userData.uname = user.uname;
  userData.avatar = user.avatar;
  userData.profession = user.profession;
  userData.accountPrivacy = user.accountPrivacy;
  userData.accountStatus = user.accountStatus;
  userData.isVerified = user.isVerified;
  userData.createdAt = user.createdAt;
  userData.followingStatus = followingStatus;

  return userData;
};

utility.getHashTags = (caption) => {
  const hashtags = caption.match(/#[a-zA-Z0-9]+/g);

  if (hashtags) {
    return hashtags.map((hashtag) => hashtag.replace("#", ""));
  }

  return [];
};

utility.getMentions = (caption) => {
  const mentions = caption.match(/@[a-zA-Z0-9]+/g);

  if (mentions) {
    return mentions.map((mention) => mention.replace("@", ""));
  }

  return [];
};

utility.getPostData = async (postId, reqUser) => {
  const post = await models.Post.findById(postId);
  const postData = {};
  const ownerData = await utility.getOwnerData(post.owner, reqUser);
  const isLiked = await utility.checkIfPostLiked(post._id, reqUser);
  const hashtags = await utility.getHashTags(post.caption);
  const mentions = await utility.getMentions(post.caption);

  postData._id = post._id;
  postData.caption = post.caption;
  postData.mediaFiles = post.mediaFiles;
  postData.owner = ownerData;
  postData.hashtags = hashtags;
  postData.userMentions = mentions;
  postData.postType = post.postType;
  postData.likesCount = post.likesCount;
  postData.commentsCount = post.commentsCount;
  postData.isLiked = isLiked;
  postData.postStatus = post.postStatus;
  postData.createdAt = post.createdAt;

  return postData;
};

utility.getCommentData = async (commentId, reqUser) => {
  const comment = await models.Comment.findById(commentId);
  const commentData = {};

  const ownerData = await utility.getOwnerData(comment.user, reqUser);

  commentData._id = comment._id;
  commentData.comment = comment.comment;
  commentData.post = comment.post;
  commentData.user = ownerData;
  commentData.likesCount = comment.likesCount;
  commentData.commentStatus = comment.commentStatus;
  commentData.createdAt = comment.createdAt;

  return commentData;
};

utility.getNotificationData = async (notificationId, reqUser) => {
  const notification = await models.Notification.findById(notificationId);

  const notificationData = {};

  const ownerData = await utility.getOwnerData(notification.owner, reqUser);
  const userData = await utility.getUserData(notification.user, reqUser);

  notificationData._id = notification._id;
  notificationData.owner = ownerData;
  notificationData.user = userData;
  notificationData.refId = notification.refId;
  notificationData.body = notification.body;
  notificationData.type = notification.type;
  notificationData.isRead = notification.isRead;
  notificationData.createdAt = notification.createdAt;

  return notificationData;
};

utility.getHashTagData = async (hashTagId) => {
  const hashTag = await models.Tag.findById(hashTagId);
  const hashTagData = {};

  hashTagData._id = hashTag._id;
  hashTagData.name = hashTag.name;
  hashTagData.posts = hashTag.posts;
  hashTagData.postsCount = hashTag.postsCount;
  hashTagData.createdAt = hashTag.createdAt;

  return hashTagData;
};


export default utility;
