import mongoose from "mongoose";

const blueTickRequestSchema = new mongoose.Schema({
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

    profession: {
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

    otherPlatformProfileLinks: {
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
        type: Boolean,
        default: false,
    },

    articleLinks: {
        type: String,
    },

    articleDocument: {
        public_id: String,
        url: String,
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

blueTickRequestSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const BlueTickRequest = mongoose.model("BlueTickRequest", blueTickRequestSchema);

export default BlueTickRequest;