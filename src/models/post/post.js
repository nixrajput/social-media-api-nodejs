import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  caption: String,

  mediaFiles: [
    {
      public_id: String,
      url: String,
      thumbnail: String,
      mediaType: String,
    }
  ],

  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },

  likes: [
    {
      likedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },

      likedAt: {
        type: Date,
        default: Date.now,
      },
    }
  ],

  likesCount: {
    type: Number,
    default: 0,
  },

  comments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
    },
  ],

  commentsCount: {
    type: Number,
    default: 0,
  },

  postStatus: {
    type: String,
    enum: ["active", "deleted", "reported", "drafted", "archived"],
    default: "active",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

postSchema.index({ caption: "text" });
const Post = mongoose.model("Post", postSchema);

export default Post;
