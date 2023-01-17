import catchAsyncError from "../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../helpers/errorHandler.js";
import models from "../../../models/index.js";
import ResponseMessages from "../../../contants/responseMessages.js";
import validators from "../../../utils/validators.js";
import utility from "../../../utils/utility.js";

/// @route POST /api/v1/create-project

const createProject = catchAsyncError(async (req, res, next) => {
    const {
        title, description, icon, category, projectType, screenshots,
        features, tags, downloadUrl, demoUrl, githubUrl, websiteUrl
    } = req.body;

    if (!title) {
        return next(new ErrorHandler(ResponseMessages.TITLE_REQUIRED, 400));
    }

    if (!description) {
        return next(new ErrorHandler(ResponseMessages.DESCRIPTION_REQUIRED, 400));
    }

    if (!icon) {
        return next(new ErrorHandler(ResponseMessages.ICON_REQUIRED, 400));
    }

    if (icon) {
        if (!icon.publicId) {
            return next(new ErrorHandler(ResponseMessages.PUBLIC_ID_REQUIRED, 400));
        }

        if (!icon.url) {
            return next(new ErrorHandler(ResponseMessages.URL_REQUIRED, 400));
        }

        if (!validators.validateUrl(icon.url)) {
            return next(new ErrorHandler(ResponseMessages.INVALID_ICON_URL, 400));
        }
    }

    if (!features) {
        return next(new ErrorHandler(ResponseMessages.FEATURES_REQUIRED, 400));
    }

    if (!screenshots) {
        return next(new ErrorHandler(ResponseMessages.SCREENSHOTS_REQUIRED, 400));
    }

    if (screenshots && screenshots.length > 0) {
        for (let i = 0; i < screenshots.length; i++) {
            if (!screenshots[i].publicId) {
                return next(new ErrorHandler(ResponseMessages.PUBLIC_ID_REQUIRED, 400));
            }

            if (!screenshots[i].url) {
                return next(new ErrorHandler(ResponseMessages.URL_REQUIRED, 400));
            }

            if (!validators.validateUrl(screenshots[i].url)) {
                return next(new ErrorHandler(ResponseMessages.INVALID_SCREENSHOT_URL, 400));
            }
        }
    }

    if (downloadUrl && !validators.validateUrl(downloadUrl)) {
        return next(new ErrorHandler(ResponseMessages.INVALID_DOWNLOAD_URL, 400));
    }

    if (demoUrl && !validators.validateUrl(demoUrl)) {
        return next(new ErrorHandler(ResponseMessages.INVALID_DEMO_URL, 400));
    }

    if (githubUrl && !validators.validateUrl(githubUrl)) {
        return next(new ErrorHandler(ResponseMessages.INVALID_GITHUB_URL, 400));
    }

    if (websiteUrl && !validators.validateUrl(websiteUrl)) {
        return next(new ErrorHandler(ResponseMessages.INVALID_WEBSITE_URL, 400));
    }

    const tempSlug = await utility.generateSlug(title);

    if (!tempSlug) {
        return next(new ErrorHandler(ResponseMessages.SLUG_NOT_GENERATED, 400));
    }

    const newProject = {
        slug: tempSlug,
        title: title,
        description: description,
        icon: icon,
        category: category,
        projectType: projectType,
        features: features,
        tags: tags,
        downloadUrl: downloadUrl,
        demoUrl: demoUrl,
        githubUrl: githubUrl,
        websiteUrl: websiteUrl,
        owner: req.user._id,
    };

    const project = await models.Project.create(newProject);

    if (!project) {
        return next(new ErrorHandler(ResponseMessages.PROJECT_NOT_CREATED, 400));
    }

    if (screenshots && screenshots.length > 0) {
        for (let i = 0; i < screenshots.length; i++) {
            const newScreenshot = {
                project: project._id,
                publicId: screenshots[i].publicId,
                url: screenshots[i].url,
            };

            const screenshot = await models.ProjectScreenshot.create(newScreenshot);

            project.screenshots.push(screenshot._id);
        }
    }

    await project.save();

    return res.status(200).json({
        success: true,
        message: ResponseMessages.PROJECT_CREATED,
    });
});

export default createProject;
