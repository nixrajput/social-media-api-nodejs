import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.js";
import chatController from "../controllers/index.js";

const chatRouter = Router();

const isAuthenticatedUser = authMiddleware.isAuthenticatedUser;

// Authenticated Routes -------------------------------------------------------

chatRouter
    .route("/get-messages-by-id")
    .get(isAuthenticatedUser, chatController.getMessagesById);

chatRouter
    .route("/get-all-last-messages")
    .get(isAuthenticatedUser, chatController.getAllLastMessages);

export default chatRouter;
