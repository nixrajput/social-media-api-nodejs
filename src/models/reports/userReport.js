import mongoose from "mongoose";

const userReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },

    reporter: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },

    reportType: {
        type: String,
        enum: [
            "spam", "harassment", "inappropriate",
            "violence", "other", "abuse"
        ],
        default: "spam",
    },

    reportReason: {
        type: String,
    },

    reportStatus: {
        type: String,
        enum: [
            "pending", "resolved", "rejected",
            "ignored", "closed"
        ],
        default: "pending",
    },

    resolvedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },

    resolvedAt: {
        type: Date,
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

userReportSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "username email avatar",
    }).populate({
        path: "reporter",
        select: "username email avatar",
    });

    next();
});

userReportSchema.pre("save", function (next) {
    this.updatedAt = Date.now();

    next();
});

const UserReport = mongoose.model("UserReport", userReportSchema);

export default UserReport;