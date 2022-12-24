import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name for the tag"],
        unique: true,
        trim: true,
        maxlength: [50, "A tag name cannot be more than 50 characters"],
    },

    postsCount: {
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

tagSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

tagSchema.index({ name: "text" });
const Tag = mongoose.model("Tag", tagSchema);

export default Tag;