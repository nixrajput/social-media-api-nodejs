import mongoose from "mongoose";

const commentLikeSchema = new mongoose.Schema({
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
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

commentLikeSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const CommentLike = mongoose.model("CommentLike", commentLikeSchema);

export default CommentLike;