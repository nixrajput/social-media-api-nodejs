import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  tempId: String,

  caption: {
    type: String,
    maxlength: 1000,
  },

  postType: {
    type: String,
    enum: [
      "media", "poll", "text",
      "question", "link", "event"
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
        enum: [
          "image", "video", "audio", "document",
          "gif", ""
        ],
        default: "image",
      },
    }
  ],

  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  likesCount: {
    type: Number,
    default: 0,
  },

  commentsCount: {
    type: Number,
    default: 0,
  },

  repostsCount: {
    type: Number,
    default: 0,
  },

  sharesCount: {
    type: Number,
    default: 0,
  },

  savesCount: {
    type: Number,
    default: 0,
  },

  pollQuestion: {
    type: String,
    maxlength: 1000,
  },

  pollOptions: [
    {
      option: {
        type: String,
        maxlength: 30,
      },
      votes: {
        type: Number,
        default: 0,
      },
    }
  ],

  totalVotes: {
    type: Number,
    default: 0,
  },

  pollLength: {
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
