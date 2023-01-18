import cloudinary from "cloudinary";
import catchAsyncError from "../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../helpers/errorHandler.js";
import models from "../../../models/index.js";
import ResponseMessages from "../../../contants/responseMessages.js";
import utility from "../../../utils/utility.js";
import validators from "../../../utils/validators.js";

/// @route PUT /api/v1/update-project

const updateProject = catchAsyncError(async (req, res, next) => {
    const { projectId } = req.query;

    if (!projectId) {
        return next(new ErrorHandler(ResponseMessages.PROJECT_ID_REQUIRED, 400));
    }

    const {
        title, description, icon, tags, features, projectType,
        projectStatus, category, downloadUrl, demoUrl, githubUrl,
        websiteUrl, screenshots
    } = req.body;

    const project = await models.Project.findById(projectId);

    if (!project) {
        return next(new ErrorHandler(ResponseMessages.PROJECT_NOT_FOUND, 404));
    }

    if (project.owner.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler(ResponseMessages.UNAUTHORIZED, 401));
    }

    if (title) project.title = title;
    if (description) project.description = description;
    if (icon) project.icon = icon;
    if (tags) project.tags = tags;
    if (features) project.features = features;
    if (projectType) project.projectType = projectType;
    if (projectStatus) project.projectStatus = projectStatus;
    if (category) project.category = category;
    if (downloadUrl) project.downloadUrl = downloadUrl;
    if (demoUrl) project.demoUrl = demoUrl;
    if (githubUrl) project.githubUrl = githubUrl;
    if (websiteUrl) project.websiteUrl = websiteUrl;

    if (screenshots) {
        if (screenshots.length > 0) {
            const screenshotIds = [];

            const publicIds = screenshots.map(screenshot => screenshot.publicId);
            const projectScreenshots = await models.ProjectScreenshot.find
                ({ project: projectId });

            const screenshotsToDelete = projectScreenshots.filter(projectScreenshot => {
                return !publicIds.includes(projectScreenshot.publicId);
            });

            const screenshotsToNotDelete = projectScreenshots.filter(projectScreenshot => {
                return publicIds.includes(projectScreenshot.publicId);
            });

            for (let i = 0; i < screenshotsToNotDelete.length; i++) {
                const screenshotToNotDelete = screenshotsToNotDelete[i];
                screenshotIds.push(screenshotToNotDelete._id);
            }

            for (let i = 0; i < screenshotsToDelete.length; i++) {
                const screenshotToDelete = screenshotsToDelete[i];
                await cloudinary.v2.uploader.destroy(screenshotToDelete.publicId);
                await screenshotToDelete.remove();
            }

            const screenshotsToCreate = screenshots.filter(screenshot => {
                return !projectScreenshots.map(projectScreenshot => projectScreenshot.publicId)
                    .includes(screenshot.publicId);
            });

            for (let i = 0; i < screenshotsToCreate.length; i++) {
                const screenshotToCreate = screenshotsToCreate[i];

                const projectScreenshot = await models.ProjectScreenshot.create({
                    project: projectId,
                    publicId: screenshotToCreate.publicId,
                    url: screenshotToCreate.url,
                });

                screenshotIds.push(projectScreenshot._id);
            }

            project.screenshots = screenshotIds;
        }
    }

    await project.save();

    const projectDetails = await utility.getProjectData(project._id);

    res.status(200).json({
        success: true,
        message: ResponseMessages.PROJECT_UPDATED,
        project: projectDetails,
    });

});

export default updateProject;