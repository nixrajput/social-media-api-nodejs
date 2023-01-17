import catchAsyncError from "../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../helpers/errorHandler.js";
import models from "../../../models/index.js";
import ResponseMessages from "../../../contants/responseMessages.js";
import utility from "../../../utils/utility.js";

/// @route PUT /api/v1/update-project

const updateProject = catchAsyncError(async (req, res, next) => {
    const { projectId } = req.query;

    if (!projectId) {
        return next(new ErrorHandler(ResponseMessages.PROJECT_ID_REQUIRED, 400));
    }

    const {
        title, description, icon, tags, features, projectType,
        projectStatus, category, downloadUrl, demoUrl, githubUrl,
        websiteUrl
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

    await project.save();

    const projectDetails = await utility.getProjectData(project._id);

    res.status(200).json({
        success: true,
        message: ResponseMessages.PROJECT_UPDATED,
        project: projectDetails,
    });

});

export default updateProject;