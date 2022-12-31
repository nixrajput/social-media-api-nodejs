import mongoose from "mongoose";

const postMediaSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["image", "video", "gif"],
        default: "image",
    },

    post: {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
        required: true,
    },

    publicId: {
        type: String,
        required: true,
    },

    url: {
        type: String,
        required: true,
    },

    thumbnail: {
        publicId: String,
        url: String,
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

postMediaSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const PostMedia = mongoose.model("PostMedia", postMediaSchema);

export default PostMedia;