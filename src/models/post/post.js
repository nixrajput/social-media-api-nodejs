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

  likesCount: {
    type: Number,
    default: 0,
  },

  commentsCount: {
    type: Number,
    default: 0,
  },

  postStatus: {
    type: String,
    enum: [
      "active", "deleted", "reported", "archived",
      "unarhived", "withheld", "blocked", "flagged",
      "banned", "muted", "verified", "unverified",
    ],
    default: "active",
  },

  isArchived: {
    type: Boolean,
    default: false,
  },

  visibility: {
    type: String,
    enum: [
      "public", "private", "friends", "followers",
      "mutual", "close_friends",
    ],
    default: "public",
  },

  allowComments: {
    type: Boolean,
    default: true,
  },

  allowLikes: {
    type: Boolean,
    default: true,
  },

  allowReposts: {
    type: Boolean,
    default: true,

  },

  allowShare: {
    type: Boolean,
    default: true,
  },

  allowSave: {
    type: Boolean,
    default: true,
  },

  allowDownload: {
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
  }
});

postSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

postSchema.index({ caption: "text" });
const Post = mongoose.model("Post", postSchema);

export default Post;
