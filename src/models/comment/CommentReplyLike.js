import mongoose from "mongoose";

const CommentReplyLikeSchema = new mongoose.Schema({
    commentReply: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommentReply",
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",

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

CommentReplyLikeSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const CommentReplyLike = mongoose.model("CommentReplyLike", CommentReplyLikeSchema);

export default CommentReplyLike;