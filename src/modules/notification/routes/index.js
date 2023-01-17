import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.js";
import notificationController from "../controllers/index.js";

const notificationRouter = Router();

const isAuthenticatedUser = authMiddleware.isAuthenticatedUser;

/// @route GET /api/v1/get-notifications
notificationRouter
  .route("/get-notifications")
  .get(isAuthenticatedUser, notificationController.getNotifications);

/// @route GET /api/v1/mark-read-notification
notificationRouter
  .route("/mark-read-notification")
  .get(isAuthenticatedUser, notificationController.markReadNotification);


/// @route GET /api/v1/delete-notification
notificationRouter
  .route("/delete-notification")
  .get(isAuthenticatedUser, notificationController.deleteNotification);

export default notificationRouter;
