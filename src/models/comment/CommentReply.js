import mongoose from "mongoose";

const commentReplySchema = new mongoose.Schema({
    reply: {
        type: String,
        required: true,
    },

    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
    },

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    likesCount: {
        type: Number,
        default: 0,
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

    replyStatus: {
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

commentReplySchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const CommentReply = mongoose.model("CommentReply", commentReplySchema);

export default CommentReply;