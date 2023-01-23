import mongoose from "mongoose";

const verificationRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    legalName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    document: {
        public_id: String,
        url: String,
    },

    isVerifiedOnOtherPlatform: {
        type: String,
        enum: ["yes", "no"],
        required: true,
        default: "no",
    },

    otherPlatformLinks: {
        type: String,
    },

    hasWikipediaPage: {
        type: String,
        enum: ["yes", "no"],
        required: true,
        default: "no",
    },

    wikipediaPageLink: {
        type: String,
    },

    featuredInArticles: {
        type: String,
        enum: ["yes", "no"],
        required: true,
        default: "no",
    },

    articleLinks: {
        type: String,
    },

    otherLinks: {
        type: String,
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },

    approvedAt: {
        type: Date,
    },

    rejectedAt: {
        type: Date,
    },

    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    rejectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    reason: {
        type: String,
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

verificationRequestSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

verificationRequestSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user approvedBy rejectedBy",
        select: [
            "fname", "lname", "uname", "email", "avatar",
            "accountStatus", "isVerified", "verificationRequestedAt",
            "verifiedAt", "role", "createdAt", "updatedAt"
        ],
    });

    next();
});

const VerificationRequest = mongoose.model("VerificationRequest", verificationRequestSchema);

export default VerificationRequest;