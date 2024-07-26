"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_1 = __importDefault(require("../controllers/post/post"));
const post_2 = __importDefault(require("../services/post"));
const PostRouter = (0, express_1.Router)();
const postSvc = new post_2.default();
const postCtlr = new post_1.default(postSvc);
PostRouter.route("/feed").all(postCtlr.getPostFeed);
exports.default = PostRouter;
//# sourceMappingURL=post.js.map