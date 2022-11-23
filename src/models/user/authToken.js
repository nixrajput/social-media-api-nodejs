import mongoose from "mongoose";

const authTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    expiresAt: {
        type: Date,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const AuthToken = mongoose.model("AuthToken", authTokenSchema);

export default AuthToken;