import mongoose from "mongoose";

const postMediaSchema = new mongoose.Schema({
    mediaType: {
        type: String,
        enum: ["image", "video", "gif"],
        default: "image",
    },

    public_id: {
        type: String,
        required: true,
    },

    url: {
        type: String,
        required: true,
    },

    thumbnail: {
        public_id: String,
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