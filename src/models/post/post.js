import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  caption: String,

  postType: {
    type: String,
    enum: ["media", "poll", "text", "media_and_poll",
      "media_and_text", "poll_and_text",
      "media_and_poll_and_text",
    ],
    default: "media",
  },

  mediaFiles: [
    {
      public_id: String,
      url: String,
      thumbnail: {
        public_id: String,
        url: String,
      },
      mediaType: {
        type: String,
        enum: ["image", "video",],
        default: "image",
      },
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

postSchema.index({ caption: "text" });
const Post = mongoose.model("Post", postSchema);

export default Post;
