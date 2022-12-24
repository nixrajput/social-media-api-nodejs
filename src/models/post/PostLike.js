import mongoose from "mongoose";

const postLikeSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

postLikeSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const PostLike = mongoose.model("PostLike", postLikeSchema);

export default PostLike;