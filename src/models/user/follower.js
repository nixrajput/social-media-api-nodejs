import mongoose from "mongoose";

const followerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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

followerSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const Follower = mongoose.model("Follower", followerSchema);

export default Follower;