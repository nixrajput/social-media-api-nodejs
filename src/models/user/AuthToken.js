import mongoose from "mongoose";

const AuthTokenSchema = new mongoose.Schema({
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
        type: Number,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
});

AuthTokenSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const AuthToken = mongoose.model("AuthToken", AuthTokenSchema);

export default AuthToken;