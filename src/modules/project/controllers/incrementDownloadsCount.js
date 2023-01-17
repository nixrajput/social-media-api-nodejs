import catchAsyncError from "../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../helpers/errorHandler.js";
import models from "../../../models/index.js";
import ResponseMessages from "../../../contants/responseMessages.js";

/// @route GET /api/v1/increment-downloads-count

const incrementDownloadsCount = catchAsyncError(async (req, res, next) => {
    const { projectId } = req.query;

    if (!projectId) {
        return next(new ErrorHandler(ResponseMessages.PROJECT_ID_REQUIRED, 400));
    }

    const project = await models.Project.findById(projectId)
        .select("downloadsCount");

    if (!project) {
        return next(new ErrorHandler(ResponseMessages.PROJECT_NOT_FOUND, 404));
    }

    project.downloadsCount = project.downloadsCount + 1;
    await project.save();

    res.status(200).json({
        success: true,
        message: ResponseMessages.DOWNLOADS_COUNT_INCREMENTED_SUCCESSFULLY
    });
});

export default incrementDownloadsCount;