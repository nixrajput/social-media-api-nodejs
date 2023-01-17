import cloudinary from "cloudinary";
import catchAsyncError from "../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../helpers/errorHandler.js";
import models from "../../../models/index.js";
import ResponseMessages from "../../../contants/responseMessages.js";
import utility from "../../../utils/utility.js";

/// @route DELETE /api/v1/delete-project

const deleteProject = catchAsyncError(async (req, res, next) => {
    const { projectId } = req.query;

    if (!projectId) {
        return next(new ErrorHandler(ResponseMessages.PROJECT_ID_REQUIRED, 400));
    }

    const project = await models.Project.findById(projectId);

    if (!project) {
        return next(new ErrorHandler(ResponseMessages.PROJECT_NOT_FOUND, 404));
    }

    if (project.owner.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler(ResponseMessages.UNAUTHORIZED, 401));
    }

    if (project.screenshots.length > 0) {
        for (let i = 0; i < project.screenshots.length; i++) {

            var screenshot = await models.ProjectScreenshot.findById(project.screenshots[i]);

            let publicId = screenshot.publicId;

            await cloudinary.v2.uploader.destroy(publicId);

            await screenshot.remove();
        }
    }

    await project.remove();

    res.status(200).json({
        success: true,
        message: ResponseMessages.PROJECT_DELETED,
    });
});

export default deleteProject;