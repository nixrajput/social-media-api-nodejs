import mongoose from "mongoose";

const commentReportSchema = new mongoose.Schema({
    comment: {
        type: mongoose.Schema.ObjectId,
        ref: "Comment",
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

commentReportSchema.pre(/^find/, function (next) {
    this.populate({
        path: "comment",
        select: "commentContent commentStatus visibility allowComments allowLikes allowReposts",
    }).populate({
        path: "reporter",
        select: "username email avatar",
    });

    next();
});

commentReportSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const CommentReport = mongoose.model("CommentReport", commentReportSchema);

export default CommentReport;
