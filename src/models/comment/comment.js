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

  likesCount: {
    type: Number,
    default: 0,
  },

  commentStatus: {
    type: String,
    enum: [
      "active", "deleted", "reported", "archived",
      "unarhived", "withheld", "flagged", "hidden",
      "removed",
    ],
    default: "active",
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
