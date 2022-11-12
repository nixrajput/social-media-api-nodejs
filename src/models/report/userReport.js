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
        default: "This user is spam",
    },

    reportStatus: {
        type: String,
        enum: [
            "pending", "resolved", "dismissed", "flagged",
            "banned", "muted", "verified", "unverified"
        ],
        default: "pending",
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