import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    slug: {
        type: String,
        unique: true,
    },

    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
        maxlength: 1000,
    },

    icon: {
        publicId: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },

    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },

    category: {
        type: String,
        enum: [
            "business", "education", "entertainment",
            "finance", "food", "games", "health",
            "lifestyle", "medical", "music", "news",
            "photography", "productivity", "shopping",
            "social", "sports", "travel", "utilities",
            "weather", "other"
        ],
        default: "other",
    },

    projectType: {
        type: String,
        enum: ["mobile", "web", "desktop", "other"],
        default: "other",
    },

    projectStatus: {
        type: String,
        enum: ["active", "inactive", "archived"],
        default: "active",
    },

    screenshots: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "ProjectScreenshot",
        },
    ],

    features: [
        {
            type: String,
        },
    ],

    tags: [
        {
            type: String,
        },
    ],

    downloadUrl: {
        type: String,
    },

    demoUrl: {
        type: String,
    },

    githubUrl: {
        type: String,
    },

    websiteUrl: {
        type: String,
    },

    rating: {
        type: Number,
        default: 0,
    },

    likesCount: {
        type: Number,
        default: 0,
    },

    reviewsCount: {
        type: Number,
        default: 0,
    },

    downloadsCount: {
        type: Number,
        default: 0,
    },

    viewsCount: {
        type: Number,
        default: 0,
    },

    isFeatured: {
        type: Boolean,
        default: false,
    },

    isTrending: {
        type: Boolean,
        default: false,
    },

    isPopular: {
        type: Boolean,
        default: false,
    },

    isTopRated: {
        type: Boolean,
        default: false,
    },

    isFree: {
        type: Boolean,
        default: false,
    },

    isPremium: {
        type: Boolean,
        default: false,
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

projectSchema.pre("save", function (next) {
    if (!this.isModified("slug")) {
        this.updatedAt = Date.now();

        next();
    }

    this.updatedAt = Date.now();
    next();
});

projectSchema.index({
    title: "text", description: "text",
    tags: "text", slug: "text"
});
const Project = mongoose.model("Project", projectSchema);

export default Project;