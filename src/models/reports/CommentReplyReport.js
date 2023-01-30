import mongoose from "mongoose";

const commentReplyReportSchema = new mongoose.Schema({
    commentReply: {
        type: mongoose.Schema.ObjectId,
        ref: "CommentReply",
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

commentReplyReportSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const CommentReplyReport = mongoose.model("CommentReplyReport", commentReplyReportSchema);

export default CommentReplyReport;
