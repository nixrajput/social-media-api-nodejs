import catchAsyncError from "../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../helpers/errorHandler.js";
import models from "../../../models/index.js";
import ResponseMessages from "../../../contants/responseMessages.js";
import utility from "../../../utils/utility.js";

/// @route GET /api/v1/get-project-details

const getProjectDetails = catchAsyncError(async (req, res, next) => {
    const { projectId, slug } = req.query;

    if (!projectId && !slug) {
        return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
    }

    let project = null;

    if (projectId) {
        project = await models.Project.findOne({
            _id: projectId,
            projectStatus: "active",
        }).select("_id");
    }
    else if (slug) {
        project = await models.Project.findOne({
            slug,
            projectStatus: "active",
        }).select("_id");
    }

    if (!project) {
        return next(new ErrorHandler(ResponseMessages.PROJECT_NOT_FOUND, 404));
    }

    const projectDetails = await utility.getProjectData(project._id);

    res.status(200).json({
        success: true,
        project: projectDetails,
    });
});

export default getProjectDetails;