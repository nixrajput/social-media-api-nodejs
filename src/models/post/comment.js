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

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
