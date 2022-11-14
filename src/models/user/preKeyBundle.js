import mongoose from "mongoose";

const preKeyBundleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },

    preKeyBundle: {
        type: Object,
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

preKeyBundleSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const PreKeyBundle = mongoose.model("PreKeyBundle", preKeyBundleSchema);

export default PreKeyBundle;