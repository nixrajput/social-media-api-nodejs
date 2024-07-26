"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enums_1 = require("../enums");
const PostSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: enums_1.EPostStatus,
        default: enums_1.EPostStatus.active,
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
const Post = (0, mongoose_1.model)("Post", PostSchema);
exports.default = Post;
//# sourceMappingURL=Post.js.map