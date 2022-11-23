import catchAsyncError from "../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../helpers/errorHandler.js";
import ResponseMessages from "../../../contants/responseMessages.js";
import axios from "axios";

/// CHECK UPDATE FROM GITHUB ///

const checkUpdateFromGithub = catchAsyncError(async (req, res, next) => {
    const { repoName, currentVersion } = req.body;

    if (!repoName) {
        return next(new ErrorHandler(ResponseMessages.REPO_NAME_REQUIRED, 400));
    }

    if (!currentVersion) {
        return next(new ErrorHandler(ResponseMessages.CURRENT_VERSION_REQUIRED, 400));
    }

    const username = process.env.GITHUB_USERNAME;

    const githubApiUrl = `https://api.github.com/repos/${username}/${repoName}/releases/latest`;
    const headers = {
        'Content-Type': "application/json",
        'authorization': `token ${process.env.GITHUB_TOKEN}`
    }

    const response = await axios.get(githubApiUrl, { headers });

    if (response.status !== 200) {
        return next(new ErrorHandler(ResponseMessages.GITHUB_API_ERROR, 400));
    }

    const data = response.data;

    const latestVersion = data.tag_name.substring(1);
    const changelog = data.body;
    const publishedAt = data.published_at;

    const latestBuildVersion = latestVersion.split('+')[0];
    const latestBuildNumber = latestVersion.split('+')[1];
    const splittedLatestBuildVersion = latestBuildVersion.split('.');

    const currentBuildVersion = currentVersion.split('+')[0];
    const currentBuildNumber = currentVersion.split('+')[1];
    const splittedCurrentBuildVersion = currentBuildVersion.split('.');

    let isUpdateAvailable = false;
    let message = ResponseMessages.NO_UPDATE_AVAILABLE;

    if (Number(splittedLatestBuildVersion[0]) > Number(splittedCurrentBuildVersion[0])) {
        isUpdateAvailable = true;
        message = ResponseMessages.UPDATE_AVAILABLE;

        return res.status(200).json({
            success: true,
            message: message,
            data: {
                currentVersion,
                latestVersion,
                changelog,
                publishedAt,
                isUpdateAvailable,
            }
        });
    }

    if (Number(splittedLatestBuildVersion[0]) === Number(splittedCurrentBuildVersion[0])) {
        if (Number(splittedLatestBuildVersion[1]) > Number(splittedCurrentBuildVersion[1])) {
            isUpdateAvailable = true;
            message = ResponseMessages.UPDATE_AVAILABLE;

            return res.status(200).json({
                success: true,
                message: message,
                data: {
                    currentVersion,
                    latestVersion,
                    changelog,
                    publishedAt,
                    isUpdateAvailable,
                }
            });
        }
    }

    if (Number(splittedLatestBuildVersion[0]) === Number(splittedCurrentBuildVersion[0])
        && Number(splittedLatestBuildVersion[1]) === Number(splittedCurrentBuildVersion[1])) {
        if (Number(splittedLatestBuildVersion[2]) > Number(splittedCurrentBuildVersion[2])) {
            isUpdateAvailable = true;
            message = ResponseMessages.UPDATE_AVAILABLE;

            return res.status(200).json({
                success: true,
                message: message,
                data: {
                    currentVersion,
                    latestVersion,
                    changelog,
                    publishedAt,
                    isUpdateAvailable,
                }
            });
        }
    }

    if (Number(splittedLatestBuildVersion[0]) === Number(splittedCurrentBuildVersion[0])
        && Number(splittedLatestBuildVersion[1]) === Number(splittedCurrentBuildVersion[1])
        && Number(splittedLatestBuildVersion[2]) === Number(splittedCurrentBuildVersion[2])) {
        if (Number(latestBuildNumber) > Number(currentBuildNumber)) {
            isUpdateAvailable = true;
            message = ResponseMessages.UPDATE_AVAILABLE;

            return res.status(200).json({
                success: true,
                message: message,
                data: {
                    currentVersion,
                    latestVersion,
                    changelog,
                    publishedAt,
                    isUpdateAvailable,
                }
            });
        }
    }

    res.status(200).json({
        success: true,
        message: message,
        data: {
            currentVersion,
            latestVersion,
            changelog,
            publishedAt,
            isUpdateAvailable,
        }
    });
})

export default checkUpdateFromGithub;