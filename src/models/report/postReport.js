import mongoose from "mongoose";

const postReportSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
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
        default: "This post is spam",
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

postReportSchema.pre(/^find/, function (next) {
    this.populate({
        path: "post",
        select: "postType postContent postStatus visibility allowComments allowLikes allowReposts",
    }).populate({
        path: "reporter",
        select: "username email avatar",
    });

    next();
});

postReportSchema.pre("save", function (next) {
    this.updatedAt = Date.now();

    next();
});

const PostReport = mongoose.model("PostReport", postReportSchema);

export default PostReport;