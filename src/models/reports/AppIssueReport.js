import mongoose from "mongoose";

const appIssueReportSchema = new mongoose.Schema({
    issue: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
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

appIssueReportSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const AppIssueReport = mongoose.model("AppIssueReport", appIssueReportSchema);

export default AppIssueReport;