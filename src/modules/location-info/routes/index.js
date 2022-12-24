import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.js";
import locationInfoController from "../controllers/index.js";

const locationInfoRouter = Router();

const isAuthenticatedUser = authMiddleware.isAuthenticatedUser;

locationInfoRouter
    .route("/get-location-info")
    .get(isAuthenticatedUser, locationInfoController.getLocationInfo);

export default locationInfoRouter;
