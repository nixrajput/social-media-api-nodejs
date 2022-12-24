import mongoose from "mongoose";

const feedbackReportSchema = new mongoose.Schema({
    feedback: {
        type: String,
        required: [true, "Please enter a feedback."],
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

feedbackReportSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const FeedbackReport = mongoose.model("FeedbackReport", feedbackReportSchema);

export default FeedbackReport;