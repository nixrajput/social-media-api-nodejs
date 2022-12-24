import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.js";
import tagController from "../controllers/index.js";

const tagRouter = Router();

const isAuthenticatedUser = authMiddleware.isAuthenticatedUser;

// Authenticated Routes -------------------------------------------------------

tagRouter
    .route("/search-tag")
    .get(isAuthenticatedUser, tagController.searchTag);

tagRouter
    .route("/get-posts-by-tag")
    .get(isAuthenticatedUser, tagController.getPostsByTag);

tagRouter
    .route("/get-trending-tags")
    .get(isAuthenticatedUser, tagController.getTrendingTags);

export default tagRouter;
