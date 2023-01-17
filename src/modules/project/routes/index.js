import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.js";
import projectControllers from "../controllers/index.js";

const isAuthenticatedUser = authMiddleware.isAuthenticatedUser;

const projectRouter = Router();

/// @route POST /api/v1/create-project
projectRouter.route("/create-project")
    .post(isAuthenticatedUser, projectControllers.createProject);

/// @route PUT /api/v1/update-project
projectRouter.route("/update-project")
    .put(isAuthenticatedUser, projectControllers.updateProject);

/// @route DELETE /api/v1/delete-project
projectRouter.route("/delete-project")
    .delete(isAuthenticatedUser, projectControllers.deleteProject);

/// @route GET /api/v1/get-projects
projectRouter.route("/get-projects")
    .get(projectControllers.getProjects);

/// @route GET /api/v1/increment-downloads-count
projectRouter.route("/increment-downloads-count")
    .get(projectControllers.incrementDownloadsCount);

/// @route GET /api/v1/increment-views-count
projectRouter.route("/increment-views-count")
    .get(projectControllers.incrementViewsCount);

/// @route GET /api/v1/get-project-details
projectRouter.route("/get-project-details")
    .get(projectControllers.getProjectDetails);


export default projectRouter;
