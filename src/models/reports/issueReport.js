import mongoose from "mongoose";

const issueReportSchema = new mongoose.Schema({
    issue: {
        type: String,
        required: [true, "Please enter an issue."],
    },

    description: {
        type: String,
        required: [true, "Please enter a description."],
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Please enter a user."],
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

issueReportSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const IssueReport = mongoose.model("IssueReport", issueReportSchema);

export default IssueReport;