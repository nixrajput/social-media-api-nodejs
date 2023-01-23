import cloudinary from "cloudinary";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import ResponseMessages from "../../../../contants/responseMessages.js";
import utility from "../../../../utils/utility.js";

/// @route PUT /api/v1/update-project-screenshots

const updateProjectScreenshots = catchAsyncError(async (req, res, next) => {
    const { id, screenshots } = req.body;

    if (!id) {
        return next(new ErrorHandler(ResponseMessages.PROJECT_ID_REQUIRED, 400));
    }

    if (!screenshots) {
        return next(new ErrorHandler(ResponseMessages.SCREENSHOTS_REQUIRED, 400));
    }

    if (screenshots.length < 1) {
        return next(new ErrorHandler(ResponseMessages.SCREENSHOTS_REQUIRED, 400));
    }

    const project = await models.Project.findById(id);

    if (!project) {
        return next(new ErrorHandler(ResponseMessages.PROJECT_NOT_FOUND, 404));
    }

    if (project.owner.toString() !== req.user._id.toString()
        || req.user.role !== "admin" || req.user.role !== "superadmin"
        || req.user.role !== "moderator"
    ) {
        return next(new ErrorHandler(ResponseMessages.UNAUTHORIZED, 401));
    }

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

export default updateProjectScreenshots;