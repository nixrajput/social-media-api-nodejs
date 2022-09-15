import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cron from "node-cron";
import errorMiddleware from "./middlewares/errors.js";
import utility from "./utils/utility.js";
// import models from "./models/index.js";

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
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Schedule a task
  cron.schedule("59 23 * * *", () => {
    console.log("[cron]: task running every day at 11:59 PM");
    utility.deleteExpiredOTPs();
  });

  // (async () => {
  //   const users = await models.Post.find();
  //   console.log(users.length);
  //   for (let user of users) {
  //     // await models.Post.updateOne({ _id: post._id }, { $unset: { newLikes: 0 } });
  //     // console.log("done");

  //     // user.accountPrivacy = user.accountType;
  //     // await user.save();

  //     // await models.User.updateOne({ _id: user._id }, {
  //     //   $unset: {
  //     //     followers: [],
  //     //     following: [],
  //     //   }
  //     // });

  //     // const posts = await models.Post.find({ owner: user._id })
  //     //   .select("_id").sort({ createdAt: -1 });

  //     // console.log(posts.length);

  //     // user.postsCount = posts.length;

  //     // if (user.accountPrivacy === "private") {
  //     //   user.isPrivate = true;
  //     // }

  //     // console.log(user.accountPrivacy);

  //     // console.log(user.isPrivate);
  //     // await user.save();

  //     // const followers = await models.Follower.find({ user: user._id })
  //     //   .select("_id").sort({ createdAt: -1 });

  //     // const followings = await models.Follower.find({ follower: user._id })
  //     //   .select("_id").sort({ createdAt: -1 });

  //     // const followersCount = followers.length;
  //     // const followingCount = followings.length;

  //     // user.followersCount = followersCount;
  //     // user.followingCount = followingCount;

  //     // await user.save();

  //     // await models.Follower.deleteOne({ _id: post._id });

  //     //console.log(post.updatedAt);

  //     //console.log(post.likes);

  //     // if (post.followers.length > 0) {
  //     //   for (let like of post.followers) {
  //     //     await models.Follower.create({
  //     //       user: post._id,
  //     //       follower: like.user,
  //     //       createdAt: like.createdAt,
  //     //     });
  //     //   }
  //     // }

  //     //await post.save();

  //     //let postLikes = post.newLikes;
  //     // console.log(postLikes);
  //     // let postComments = post.comments;
  //     // let postLikesCount = postLikes.length;
  //     // let postCommentsCount = postComments.length;

  //     // let newFollowers = user.followers;
  //     // let newFollowing = user.following;

  //     // if (newFollowers.length > 0) {
  //     //   for (let newFollower of newFollowers) {
  //     //     user.newFollowers.push({
  //     //       user: newFollower,
  //     //     });
  //     //   }
  //     // }

  //     // if (newFollowing.length > 0) {
  //     //   for (let item of newFollowing) {
  //     //     user.newFollowings.push({
  //     //       user: item,
  //     //     });
  //     //   }
  //     // }

  //     // user.followers = user.newFollowers;
  //     // user.following = user.newFollowings;

  //     // let postsCount = user.posts.length;
  //     // user.postsCount = postsCount;

  //     //await user.save();

  //     //console.log(newFollowers)


  //     // user.followersCount = followersCount;
  //     // user.newF = followingCount;

  //     // await user.save();

  //     // for (let like of postLikes) {
  //     //   console.log(like);
  //     //   post.newLikes1.push({
  //     //     likedBy: like.likedBy,
  //     //     likedAt: like.likedAt,
  //     //   });
  //     // }
  //     // let user = await models.User.findById(like.likedBy);
  //     // user.likes.push(post._id);
  //     // let postNewLikes = post.newLikes1;
  //     // post.likes = postNewLikes;
  //     // await post.save();

  //     // post.likesCount = postLikesCount;
  //     // post.commentsCount = postCommentsCount;
  //     // await post.save();
  //   }
  //   console.log("operation done");
  // })();

  // Index Route
  app.route("/").get(function (req, res) {
    res.status(200).json({
      success: true,
      message: "server is up and running",
    });
  });

  return app;
};

export const closeApp = (app) => {
  // Middleware for Errors
  app.use(errorMiddleware);
  app.use("*", (req, res, next) => {
    res.status(404).json({
      success: false,
      message: "api endpoint not found",
    });
  });
};
