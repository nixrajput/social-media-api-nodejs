import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: [
      "text", "media", "poll"
    ],
    default: "text",
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },

  post: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
  },

  likesCount: {
    type: Number,
    default: 0,
  },

  repliesCount: {
    type: Number,
    default: 0,
  },

  commentStatus: {
    type: String,
    enum: [
      "active", "deleted", "reported", "archived",
      "unarhived", "withheld", "blocked", "flagged",
      "banned", "muted", "verified", "unverified",
    ],
    default: "active",
  },

  visibility: {
    type: String,
    enum: [
      "public", "private", "followers",
      "mutual", "close_friends",
    ],
    default: "public",
  },

  allowLikes: {
    type: Boolean,
    default: true,
  },

  allowReplies: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

commentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
