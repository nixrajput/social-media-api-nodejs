import mongoose from "mongoose";

const projectScreenshotSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.ObjectId,
        ref: "Project",
        required: true,
    },

    publicId: {
        type: String,
        required: true,
    },

    url: {
        type: String,
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

projectScreenshotSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const ProjectScreenshot = mongoose.model("ProjectScreenshot", projectScreenshotSchema);

export default ProjectScreenshot;