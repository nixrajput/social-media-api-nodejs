import mongoose from "mongoose";

const fcmTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },

    token: {
        type: String,
        required: true,
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

fcmTokenSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const FcmToken = mongoose.model("FcmToken", fcmTokenSchema);

export default FcmToken;;