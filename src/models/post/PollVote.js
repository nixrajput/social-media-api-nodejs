import mongoose from "mongoose";

const pollVoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },

    poll: {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
        required: true,
    },

    option: {
        type: mongoose.Schema.ObjectId,
        ref: "PollOption",
        required: true,
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

pollVoteSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const PollVote = mongoose.model("PollVote", pollVoteSchema);

export default PollVote;