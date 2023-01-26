import mongoose from "mongoose";

const BlockedUserSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    blockedUser: {
        type: mongoose.Schema.Types.ObjectId,
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
    },
});

BlockedUserSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const BlockedUser = mongoose.model("BlockedUser", BlockedUserSchema);

export default BlockedUser;


