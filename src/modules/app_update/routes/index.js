import { Router } from "express";
import updateController from "../controllers/index.js";

const updateRouter = Router();

// Routes
updateRouter
    .route("/check-update")
    .post(updateController.checkUpdateFromGithub);

export default updateRouter;
