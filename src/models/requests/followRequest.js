import mongoose from "mongoose";

const FollowRequestSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },

    to: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
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

FollowRequestSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const FollowRequest = mongoose.model("FollowRequest", FollowRequestSchema);

export default FollowRequest;