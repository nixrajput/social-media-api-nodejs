import mongoose from "mongoose";

const pollOptionSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
        required: true,
    },

    option: {
        type: String,
        maxlength: 30,
        required: true,
    },

    votes: {
        type: Number,
        default: 0,
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

pollOptionSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const PollOption = mongoose.model("PollOption", pollOptionSchema);

export default PollOption;