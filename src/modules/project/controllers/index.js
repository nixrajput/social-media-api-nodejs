import createProject from "./createProject.js";
import getProjects from "./getProjects.js";
import incrementDownloadsCount from "./incrementDownloadsCount.js";
import incrementViewsCount from "./incrementViewsCount.js";
import getProjectDetails from "./getProjectDetails.js";
import updateProject from "./updateProject.js";
import deleteProject from "./deleteProject.js";
import searchProjects from "./searchProjects.js";

const projectControllers = {};

projectControllers.createProject = createProject;
projectControllers.getProjects = getProjects;
projectControllers.incrementDownloadsCount = incrementDownloadsCount;
projectControllers.incrementViewsCount = incrementViewsCount;
projectControllers.getProjectDetails = getProjectDetails;
projectControllers.updateProject = updateProject;
projectControllers.deleteProject = deleteProject;
projectControllers.searchProjects = searchProjects;

export default projectControllers;