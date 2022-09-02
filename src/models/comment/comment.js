import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },

  post: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
  },

  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],

  likesCount: {
    type: Number,
    default: 0,
  },

  commentStatus: {
    type: String,
    enum: [
      "active", "deleted", "reported", "archived",
      "unarhived", "withheld", "pending", "published",
      "unpublished", "rejected", "approved", "blocked",
      "banned", "muted", "verified", "unverified",
      "flagged", "hidden", "removed",
    ],
    default: "active",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
