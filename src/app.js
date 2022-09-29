import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import path from 'path';
import morgan from "morgan";
import cron from "node-cron";
import errorMiddleware from "./middlewares/errors.js";
import utility from "./utils/utility.js";
import models from "./models/index.js";

export const runApp = () => {
  const app = express();

  // Middlewares
  app.use(
    cors({
      origin: "*",
      methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
      credentials: true,
      exposedHeaders: ["x-auth-token"],
    })
  );
  app.use(helmet());
  app.use(compression());
  app.use(morgan("combined"));
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "public")));

  // Schedule a task
  cron.schedule("59 23 * * *", () => {
    console.log("[cron]: task running every day at 11:59 PM");
    utility.deleteExpiredOTPs();
    utility.deleteOldNotifications();
  });

  // (async () => {
  //   const users = await models.User.find();
  //   console.log(users.length);

  //   // for (let i = 0; i < 10; i++) {
  //   //   if (users[i]._id.toString() !== "622cd2a8bf28bebb45f64b68") {
  //   //     await models.ChatMessage.create({
  //   //       receiver: users[i]._id,
  //   //       sender: '622cd2a8bf28bebb45f64b68',
  //   //       message: `Hello to ${users[i].fname} ${users[i].lname}`,
  //   //     });
  //   //   }
  //   // }

  //   // for (let user of users) {
  //   //   // await models.Post.updateOne({ _id: post._id }, { $unset: { newLikes: 0 } });
  //   //   // console.log("done");

  //   //   // user.accountPrivacy = user.accountType;
  //   //   // await user.save();

  //   //   // await models.User.updateOne({ _id: user._id }, {
  //   //   //   $unset: {
  //   //   //     publicKeys: {},
  //   //   //     resetPasswordToken: "",
  //   //   //     resetPasswordExpire: "",
  //   //   //     //publicKey: 0,
  //   //   //   }
  //   //   // });

  //   //   // const posts = await models.Post.find({ owner: user._id })
  //   //   //   .select("_id").sort({ createdAt: -1 });

  //   //   // console.log(posts.length);

  //   //   // user.postsCount = posts.length;

  //   //   // if (user.accountPrivacy === "private") {
  //   //   //   user.isPrivate = true;
  //   //   // }

  //   //   // if (post.caption) {
  //   //   //   const hashtags = utility.getHashTags(post.caption);

  //   //   //   if (hashtags.length > 0) {
  //   //   //     for (let i = 0; i < hashtags.length; i++) {
  //   //   //       const tag = await models.Tag.findOne({ name: hashtags[i] });

  //   //   //       if (tag) {
  //   //   //         tag.postsCount++;
  //   //   //         await tag.save();
  //   //   //       } else {
  //   //   //         await models.Tag.create({
  //   //   //           name: hashtags[i],
  //   //   //           postsCount: 1,
  //   //   //         });
  //   //   //       }
  //   //   //     }
  //   //   //   }

  //   //   //   //await post.save();
  //   //   // }

  //   //   // console.log(user.accountPrivacy);

  //   //   // console.log(user.isPrivate);
  //   //   // await user.save();

  //   //   // const followers = await models.Follower.find({ user: user._id })
  //   //   //   .select("_id").sort({ createdAt: -1 });

  //   //   // const followings = await models.Follower.find({ follower: user._id })
  //   //   //   .select("_id").sort({ createdAt: -1 });

  //   //   // const followersCount = followers.length;
  //   //   // const followingCount = followings.length;

  //   //   // user.followersCount = followersCount;
  //   //   // user.followingCount = followingCount;

  //   //   // await user.save();

  //   //   // await models.Follower.deleteOne({ _id: post._id });

  //   //   //console.log(post.updatedAt);

  //   //   //console.log(post.likes);

  //   //   // if (post.followers.length > 0) {
  //   //   //   for (let like of post.followers) {
  //   //   //     await models.Follower.create({
  //   //   //       user: post._id,
  //   //   //       follower: like.user,
  //   //   //       createdAt: like.createdAt,
  //   //   //     });
  //   //   //   }
  //   //   // }

  //   //   //await post.save();

  //   //   //let postLikes = post.newLikes;
  //   //   // console.log(postLikes);
  //   //   // let postComments = post.comments;
  //   //   // let postLikesCount = postLikes.length;
  //   //   // let postCommentsCount = postComments.length;

  //   //   // let newFollowers = user.followers;
  //   //   // let newFollowing = user.following;

  //   //   // if (newFollowers.length > 0) {
  //   //   //   for (let newFollower of newFollowers) {
  //   //   //     user.newFollowers.push({
  //   //   //       user: newFollower,
  //   //   //     });
  //   //   //   }
  //   //   // }

  //   //   // if (newFollowing.length > 0) {
  //   //   //   for (let item of newFollowing) {
  //   //   //     user.newFollowings.push({
  //   //   //       user: item,
  //   //   //     });
  //   //   //   }
  //   //   // }

  //   //   // user.followers = user.newFollowers;
  //   //   // user.following = user.newFollowings;

  //   //   // let postsCount = user.posts.length;
  //   //   // user.postsCount = postsCount;

  //   //   //await user.save();

  //   //   //console.log(newFollowers)


  //   //   // user.followersCount = followersCount;
  //   //   // user.newF = followingCount;

  //   //   // await user.save();

  //   //   // for (let like of postLikes) {
  //   //   //   console.log(like);
  //   //   //   post.newLikes1.push({
  //   //   //     likedBy: like.likedBy,
  //   //   //     likedAt: like.likedAt,
  //   //   //   });
  //   //   // }
  //   //   // let user = await models.User.findById(like.likedBy);
  //   //   // user.likes.push(post._id);
  //   //   // let postNewLikes = post.newLikes1;
  //   //   // post.likes = postNewLikes;
  //   //   // await post.save();

  //   //   // post.likesCount = postLikesCount;
  //   //   // post.commentsCount = postCommentsCount;
  //   //   // await post.save();
  //   // }
  //   console.log("operation done");
  // })();

  return app;
};

export const closeApp = (app) => {
  // Middleware for Errors
  app.use(errorMiddleware);
  app.use("*", (req, res, next) => {
    res.status(404).json({
      success: false,
      server: "online",
      message: "api endpoint not found",
    });
  });
};
