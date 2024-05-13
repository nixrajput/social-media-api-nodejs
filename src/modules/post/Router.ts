/**
 * Define Post Router
 */

import { Router } from "express";
// import AuthMiddleware from "../../middlewares/Auth";
import PostController from "./PostController";
import PostService from "../../services/PostService";

const PostRouter: Router = Router();

const postSvc = new PostService();
const postCtlr = new PostController(postSvc);

/**
 * @name createPost
 * @description Perform create new post.
 * @route GET /api/v1/post/create
 * @access private
 */
// PostRouter.route("/create").all(
//   AuthMiddleware.isAuthenticatedUser,
//   postCtlr.createPost
// );

/**
 * @name getPostFeed
 * @description Perform get post feed.
 * @route GET /api/v1/post/feed
 * @access public
 */
PostRouter.route("/feed").all(postCtlr.getPostFeed);

export default PostRouter;
