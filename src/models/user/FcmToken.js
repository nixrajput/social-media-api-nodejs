import mongoose from "mongoose";

const FcmTokenSchema = new mongoose.Schema({
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

FcmTokenSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const FcmToken = mongoose.model("FcmToken", FcmTokenSchema);

export default FcmToken;;