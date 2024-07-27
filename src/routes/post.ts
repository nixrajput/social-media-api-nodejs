/**
 * Define Post Router
 */

import { Router } from "express";
// import AuthMiddleware from "../../middlewares/Auth";
import PostController from "../controllers/post/post";
import PostService from "../services/post";

const PostRouter: Router = Router();

const postSvc = new PostService();
const postCtlr = new PostController(postSvc);

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API for managing posts
 */

/**
 * @swagger
 * /api/v1/post/create:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - media
 *             properties:
 *               content:
 *                 type: string
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *       500:
 *         description: Server error
 */
// PostRouter.route("/create").all(
//   AuthMiddleware.isAuthenticatedUser,
//   postCtlr.createPost
// );

/**
 * @swagger
 * /api/v1/post/feed:
 *   get:
 *     summary: Get posts feed
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of posts per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query for posts
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Filter posts by content
 *     responses:
 *       200:
 *         description: Posts feed fetched successfully
 *       500:
 *         description: Server error
 */
PostRouter.route("/feed").all(postCtlr.getPostFeed);

export default PostRouter;
