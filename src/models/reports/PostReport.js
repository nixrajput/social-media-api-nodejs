import mongoose from "mongoose";

const postReportSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
        required: true,
    },

    reporter: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },

    reportReason: {
        type: String,
        required: true,
        maxlength: 100,
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

postReportSchema.pre("save", function (next) {
    this.updatedAt = Date.now();

    next();
});

const PostReport = mongoose.model("PostReport", postReportSchema);

export default PostReport;