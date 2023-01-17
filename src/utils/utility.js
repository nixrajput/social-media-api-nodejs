import sgMail from "@sendgrid/mail";
import twilio from "twilio";
import jwt from "jsonwebtoken";
import optGenerator from "otp-generator";
import models from "../models/index.js";
import ResponseMessages from "../contants/responseMessages.js";
import axios from "axios";

const utility = {};

utility.getIp = (req) => {
  return req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    req.socket.remoteAddress ||
    req.connection.remoteAddress;
};

utility.getLocationDetailsFromIp = async (ip) => {
  let url = `http://ip-api.com/json/${ip}`;
  const queryParams = '?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,zip,lat,lon,timezone,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query';
  url += queryParams;
  const response = await axios.get(url);
  const data = response.data;
  return data;
};

// Check Username Availability
utility.checkUsernameAvailable = async (uname) => {
  let user = await models.User.findOne({ uname });

  if (user) {
    return false;
  }

  return true;
};

utility.generateAuthToken = async (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const decodedData = jwt.decode(token);

  const authToken = await models.AuthToken.create({
    token: token,
    user: user._id,
    expiresAt: decodedData.exp
  });

  return authToken;
}

// Delete All expired OTPs
utility.deleteExpiredOTPs = async () => {
  console.log("[cron] task to delete expired OTPs has started.");
  const otps = await models.OTP.find({ isUsed: true });

  if (otps.length > 0) {
    for (let i = 0; i < otps.length; i++) {
      if (otps[i].expiresAt < Date.now()) {
        await otps[i].remove();
      }
    }
  } else {
    console.log("[cron] No OTPs found.");
  }
};

utility.deleteOldNotifications = async () => {
  console.log("[cron] task to delete old notifications has started.");
  const notifications = await models.Notification.find({
    createdAt: { $lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    isRead: true,
  });

  if (notifications.length > 0) {
    for (let i = 0; i < notifications.length; i++) {
      await notifications[i].remove();
    }
  } else {
    console.log("No Notifications to delete");
  }
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

  const isFollowing = await models.Follower
    .findOne({ user: followUser, follower: reqUser }).select("_id");

  if (isFollowing) return "following";

  const followRequest = await models.FollowRequest.findOne({
    from: reqUser._id,
    to: followUser,
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

utility.checkIfCommentOwner = async (commentId, user) => {
  const comment = await models.Comment.findById(commentId).
    select("user");

  if (comment.user.toString() === user._id.toString()) {
    return true;
  }

  return false;

};

utility.checkIfPostLiked = async (postId, user) => {
  const isLiked = await models.PostLike.findOne({ post: postId, user: user._id });

  if (isLiked) {
    return true;
  }

  return false;
};

utility.checkIfCommentLiked = async (commentId, user) => {
  const isLiked = await models.CommentLike.findOne({
    comment: commentId,
    user: user._id
  });

  if (isLiked) {
    return true;
  }

  return false;
};


utility.getOwnerData = async (ownerId, reqUser) => {
  const owner = await models.User.findById(ownerId)
    .select([
      "_id", "fname", "lname", "email", "uname", "avatar", "profession",
      "isPrivate", "accountStatus", "isVerified", "createdAt",
      "updatedAt"
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
  ownerData.followingStatus = followingStatus;
  ownerData.accountStatus = owner.accountStatus;
  ownerData.isPrivate = owner.isPrivate;
  ownerData.isValid = owner.isValid;
  ownerData.isVerified = owner.isVerified;
  ownerData.createdAt = owner.createdAt;
  ownerData.updatedAt = owner.updatedAt;

  return ownerData;
};

utility.getUserData = async (userId, reqUser) => {
  const user = await models.User.findById(userId)
    .select([
      "_id", "fname", "lname", "email", "uname", "avatar", "profession",
      "isPrivate", "accountStatus", "isVerified", "createdAt",
      "updatedAt"
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
  userData.followingStatus = followingStatus;
  userData.accountStatus = user.accountStatus;
  userData.isPrivate = user.isPrivate;
  userData.isValid = user.isValid;
  userData.isVerified = user.isVerified;
  userData.createdAt = user.createdAt;
  userData.updatedAt = user.updatedAt;

  return userData;
};

utility.getHashTags = (text) => {
  const hashtags = text.match(/#[a-zA-Z0-9]+/g);

  if (hashtags) {
    return hashtags.map((hashtag) => hashtag.replace("#", ""));
  }

  return [];
};

utility.getMentions = (text) => {
  const mentions = text.match(/@[a-zA-Z0-9_]+/g);

  if (mentions) {
    return mentions.map((mention) => mention.replace("@", ""));
  }

  return [];
};

utility.getPostLikeData = async (postLikeId, reqUser) => {
  const postLike = await models.PostLike.findById(postLikeId);

  const postLikeData = {};

  const user = await utility.getUserData(postLike.user, reqUser);

  postLikeData._id = postLike._id;
  postLikeData.likedBy = user;
  postLikeData.likedAt = postLike.createdAt;

  return postLikeData;
};

utility.checkIfPollVoted = async (postId, user) => {
  const isVoted = await models.PollVote.findOne({ poll: postId, user: user._id });

  if (isVoted) {
    return true;
  }

  return false;
};

utility.getPostData = async (postId, reqUser) => {
  const post = await models.Post.findOne({ _id: postId, postStatus: "active" });

  if (!post) {
    return null;
  }

  const ownerData = await utility.getOwnerData(post.owner, reqUser);
  const isLiked = await utility.checkIfPostLiked(post._id, reqUser);

  const postType = post.postType;

  if (postType === "poll") {
    const postData = {};
    const hashtags = await utility.getHashTags(post.pollQuestion);
    const mentions = await utility.getMentions(post.pollQuestion);
    const isVoted = await utility.checkIfPollVoted(post._id, reqUser);

    const postOptions = [];

    for (let i = 0; i < post.pollOptions.length; i++) {
      const option = post.pollOptions[i];
      const optionData = await models.PollOption.findById(option).select("-__v");

      postOptions.push(optionData);
    }

    postData._id = post._id;
    postData.postType = post.postType;
    postData.type = post.postType;

    postData.pollQuestion = post.pollQuestion;
    postData.pollOptions = postOptions;

    if (isVoted) {
      const pollVote = await models.PollVote.findOne({
        poll: post._id,
        user: reqUser._id
      })
        .select("-__v");

      if (pollVote) {
        postData.votedOption = pollVote.option;
      }
    }

    postData.pollEndsAt = post.pollEndsAt;
    postData.totalVotes = post.totalVotes;

    postData.owner = ownerData;

    postData.hashtags = hashtags;
    postData.userMentions = mentions;

    postData.likesCount = post.likesCount;
    postData.commentsCount = post.commentsCount;
    postData.repostsCount = post.repostsCount;
    postData.sharesCount = post.sharesCount;
    postData.savesCount = post.savesCount;

    postData.isLiked = isLiked;
    postData.isVoted = isVoted;

    postData.allowComments = post.allowComments;
    postData.allowLikes = post.allowLikes;
    postData.allowReposts = post.allowReposts;
    postData.allowShare = post.allowShare;
    postData.allowSave = post.allowSave;
    postData.allowDownload = post.allowDownload;

    postData.visibility = post.visibility;
    postData.postStatus = post.postStatus;
    postData.status = post.postStatus;

    postData.createdAt = post.createdAt;
    postData.updatedAt = post.updatedAt;

    return postData;
  }

  const postData = {};
  let hashtags = [];
  let mentions = [];

  if (post.caption) {
    hashtags = await utility.getHashTags(post.caption);
    mentions = await utility.getMentions(post.caption);
  }

  postData._id = post._id;
  postData.postType = post.postType;
  postData.type = post.postType;

  postData.caption = post.caption;
  postData.mediaFiles = post.mediaFiles;

  postData.owner = ownerData;

  postData.hashtags = hashtags;
  postData.userMentions = mentions;

  postData.likesCount = post.likesCount;
  postData.commentsCount = post.commentsCount;
  postData.repostsCount = post.repostsCount;
  postData.sharesCount = post.sharesCount;
  postData.savesCount = post.savesCount;

  postData.isLiked = isLiked;

  postData.allowComments = post.allowComments;
  postData.allowLikes = post.allowLikes;
  postData.allowReposts = post.allowReposts;
  postData.allowShare = post.allowShare;
  postData.allowSave = post.allowSave;
  postData.allowDownload = post.allowDownload;

  postData.visibility = post.visibility;
  postData.postStatus = post.postStatus;
  postData.status = post.postStatus;

  postData.createdAt = post.createdAt;
  postData.updatedAt = post.updatedAt;

  return postData;
};

utility.getCommentData = async (commentId, reqUser) => {
  const comment = await models.Comment.findById(commentId);
  const commentData = {};

  const ownerData = await utility.getOwnerData(comment.user, reqUser);
  const isLiked = await utility.checkIfCommentLiked(comment._id, reqUser);

  commentData._id = comment._id;
  commentData.type = comment.type;

  commentData.comment = comment.comment;
  commentData.post = comment.post;

  commentData.user = ownerData;

  commentData.likesCount = comment.likesCount;
  commentData.repliesCount = comment.repliesCount;

  commentData.isLiked = isLiked;

  commentData.allowLikes = comment.allowLikes;
  commentData.allowReplies = comment.allowReplies;

  commentData.visibility = comment.visibility;
  commentData.commentStatus = comment.commentStatus;
  commentData.status = comment.commentStatus;

  commentData.createdAt = comment.createdAt;
  commentData.updatedAt = comment.updatedAt;

  return commentData;
};

utility.getNotificationData = async (notificationId, reqUser) => {
  const notification = await models.Notification.findById(notificationId);

  const notificationData = {};

  const ownerData = await utility.getOwnerData(notification.to, reqUser);
  const userData = await utility.getUserData(notification.from, reqUser);

  notificationData._id = notification._id;
  notificationData.to = ownerData;
  notificationData.from = userData;
  notificationData.refId = notification.refId;
  notificationData.body = notification.body;
  notificationData.type = notification.type;
  notificationData.isRead = notification.isRead;
  notificationData.createdAt = notification.createdAt;
  notificationData.updatedAt = notification.updatedAt;

  return notificationData;
};

utility.getHashTagData = async (hashTagId) => {
  const hashTag = await models.Tag.findById(hashTagId);
  const hashTagData = {};

  hashTagData._id = hashTag._id;
  hashTagData.name = hashTag.name;
  hashTagData.postsCount = hashTag.postsCount;
  hashTagData.createdAt = hashTag.createdAt;
  hashTagData.updatedAt = hashTag.updatedAt;

  return hashTagData;
};

utility.getFollowerData = async (followerId, reqUser) => {
  const follower = await models.Follower.findById(followerId);
  const followerData = {};

  const userData = await utility.getUserData(follower.follower, reqUser);

  followerData._id = follower._id;
  followerData.user = userData;
  followerData.createdAt = follower.createdAt;
  followerData.updatedAt = follower.updatedAt;

  return followerData;
};

utility.getFollowingData = async (followingId, reqUser) => {
  const following = await models.Follower.findById(followingId);

  const followingData = {};

  const userData = await utility.getUserData(following.user, reqUser);

  followingData._id = following._id;
  followingData.user = userData;
  followingData.createdAt = following.createdAt;
  followingData.updatedAt = following.updatedAt;

  return followingData;
};

utility.getFollowRequestData = async (followRequestId, reqUser) => {
  const followRequest = await models.FollowRequest.findById(followRequestId);

  const followRequestData = {};

  const toData = await utility.getUserData(followRequest.to, reqUser);
  const fromData = await utility.getUserData(followRequest.from, reqUser);

  followRequestData._id = followRequest._id;
  followRequestData.to = toData;
  followRequestData.from = fromData;
  followRequestData.createdAt = followRequest.createdAt;
  followRequestData.updatedAt = followRequest.updatedAt;

  return followRequestData;
};

utility.checkIfMututalFollow = async (user, reqUser) => {
  const user1Followers = await models.Follower.find({ follower: user });
  const user2Followers = await models.Follower.find({ follower: reqUser });

  const user1FollowersIds = user1Followers.map((follower) => follower.user);
  const user2FollowersIds = user2Followers.map((follower) => follower.user);

  const isMutual = user1FollowersIds.includes(reqUser) && user2FollowersIds.includes(user);

  return isMutual;
};

utility.getChatData = async (chatId) => {
  const chat = await models.ChatMessage.findById(chatId);

  const chatData = {};

  const senderData = await utility.getUserData(chat.sender, chat.sender);
  const receiverData = await utility.getUserData(chat.receiver, chat.receiver);

  let replyToData = {};

  if (chat.replyTo) {
    replyToData = await utility.getChatData(chat.replyTo);
  }

  chatData._id = chat._id;
  chatData.tempId = chat.tempId;
  chatData.senderId = chat.sender;
  chatData.receiverId = chat.receiver;
  chatData.message = chat.message;
  chatData.mediaFile = chat.mediaFile;
  chatData.replyTo = replyToData;
  chatData.sender = senderData;
  chatData.receiver = receiverData;
  chatData.sent = chat.sent;
  chatData.sentAt = chat.sentAt;
  chatData.delivered = chat.delivered;
  chatData.deliveredAt = chat.deliveredAt;
  chatData.seen = chat.seen;
  chatData.seenAt = chat.seenAt;
  chatData.createdAt = chat.createdAt;
  chatData.updatedAt = chat.updatedAt;

  return chatData;
};

utility.getProjectOwnerData = async (ownerId) => {
  const user = await models.User.findById(ownerId)
    .select([
      "_id", "fname", "lname", "email", "uname", "avatar", "profession",
      "isPrivate", "accountStatus", "isVerified", "createdAt",
      "updatedAt"
    ]);

  const userData = {};

  // const followingStatus = await utility.getFollowingStatus(reqUser, user._id);

  userData._id = user._id;
  userData.fname = user.fname;
  userData.lname = user.lname;
  userData.email = user.email;
  userData.uname = user.uname;
  userData.avatar = user.avatar;
  userData.profession = user.profession;
  // userData.followingStatus = followingStatus;
  userData.accountStatus = user.accountStatus;
  userData.isPrivate = user.isPrivate;
  userData.isValid = user.isValid;
  userData.isVerified = user.isVerified;
  userData.createdAt = user.createdAt;
  userData.updatedAt = user.updatedAt;

  return userData;
};

utility.getScrrenshotData = async (screenshotId) => {
  const screenshot = await models.ProjectScreenshot.findById(screenshotId);

  const screenshotData = {};

  screenshotData._id = screenshot._id;
  screenshotData.publicId = screenshot.publicId;
  screenshotData.url = screenshot.url;

  return screenshotData;
};

utility.getProjectData = async (projectId) => {
  const project = await models.Project.findById(projectId);

  const projectData = {};

  const ownerData = await utility.getProjectOwnerData(project.owner);

  projectData._id = project._id;
  projectData.slug = project.slug;
  projectData.title = project.title;
  projectData.description = project.description;
  projectData.icon = project.icon;
  projectData.owner = ownerData;
  projectData.category = project.category;
  projectData.projectType = project.projectType;

  if (project.screenshots.length > 0) {
    const screenshotsData = await Promise.all(project.screenshots.map(async (screenshotId) => {
      const screenshotData = await utility.getScrrenshotData(screenshotId);
      return screenshotData;
    }));

    projectData.screenshots = screenshotsData;
  }

  projectData.features = project.features;
  projectData.tags = project.tags;
  projectData.downloadUrl = project.downloadUrl;
  projectData.demoUrl = project.demoUrl;
  projectData.githubUrl = project.githubUrl;
  projectData.websiteUrl = project.websiteUrl;
  projectData.rating = project.rating;
  projectData.likesCount = project.likesCount;
  projectData.reviewsCount = project.reviewsCount;
  projectData.downloadsCount = project.downloadsCount;
  projectData.viewsCount = project.viewsCount;
  projectData.projectStatus = project.projectStatus;
  projectData.createdAt = project.createdAt;
  projectData.updatedAt = project.updatedAt;

  return projectData;
};

utility.generateRandomString = (length) => {
  let stringLength = length || 10;
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let result = "";

  for (let i = stringLength; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
};

utility.generateSlug = async (title) => {
  if (!title) return;

  const slug = title.toLowerCase().replace(/ /g, "-");

  const isSlugExists = await models.Project.findOne({ slug });

  if (isSlugExists) {
    const random = utility.generateRandomString();

    return `${slug}-${random}`;
  }

  return slug;
};

utility.getStats = async (startDate, endDate) => {
  const users = await models.User.countDocuments({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  const posts = await models.Post.countDocuments({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  const comments = await models.Comment.countDocuments({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  return {
    users,
    posts,
    comments,
  };
}

export default utility;
