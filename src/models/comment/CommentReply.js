import mongoose from "mongoose";

const commentReplySchema = new mongoose.Schema({
    reply: {
        type: String,
        required: true,
    },

    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
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