import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import ResponseMessages from "../../../../contants/responseMessages.js";
import models from "../../../../models/index.js";

/// REQUEST BLUE TICK ///

const requestBlueTick = catchAsyncError(async (req, res, next) => {
    let {
        legalName, email, phone, profession,
        document, isVerifiedOnOtherPlatform,
        otherPlatformProfileLinks, hasWikipediaPage,
        wikipediaPageLink, featuredInArticles,
        articleLinks, articleDocument
    } = req.body;

    if (!legalName) {
        return next(new ErrorHandler(ResponseMessages.LEGAL_NAME_REQUIRED, 400));
    }

    if (!email) {
        return next(new ErrorHandler(ResponseMessages.EMAIL_REQUIRED, 400));
    }

    if (!phone) {
        return next(new ErrorHandler(ResponseMessages.PHONE_REQUIRED, 400));
    }

    if (!profession) {
        return next(new ErrorHandler(ResponseMessages.PROFESSION_REQUIRED, 400));
    }

    if (!document) {
        return next(new ErrorHandler(ResponseMessages.DOCUMENT_REQUIRED, 400));
    }

    if (!isVerifiedOnOtherPlatform) {
        return next(new ErrorHandler(ResponseMessages.IS_VERIFIED_ON_OTHER_PLATFORM_REQUIRED, 400));
    }

    if (isVerifiedOnOtherPlatform === "yes") {
        if (!otherPlatformProfileLinks) {
            return next(new ErrorHandler(ResponseMessages.OTHER_PLATFORM_PROFILE_LINKS_REQUIRED, 400));
        }
    }

    if (!hasWikipediaPage) {
        return next(new ErrorHandler(ResponseMessages.HAS_WIKIPEDIA_PAGE_REQUIRED, 400));
    }

    if (hasWikipediaPage === "yes") {
        if (!wikipediaPageLink) {
            return next(new ErrorHandler(ResponseMessages.WIKIPEDIA_PAGE_LINK_REQUIRED, 400));
        }
    }

    if (!featuredInArticles) {
        return next(new ErrorHandler(ResponseMessages.FEATURED_IN_ARTICLES_REQUIRED, 400));
    }

    if (featuredInArticles === "yes") {
        if (!articleLinks) {
            return next(new ErrorHandler(ResponseMessages.ARTICLE_LINKS_REQUIRED, 400));
        }
    }

    const blueTickRequest = await models.BlueTickRequest.create({
        userId: req.user._id,
        legalName,
        email,
        phone,
        profession,
        document,
        isVerifiedOnOtherPlatform,
        otherPlatformProfileLinks,
        hasWikipediaPage,
        wikipediaPageLink,
        featuredInArticles,
        articleLinks,
        articleDocument
    });

    res.status(200).json({
        success: true,
        request: blueTickRequest,
        message: ResponseMessages.REPORT_USER_SUCCESS,
    });
});

export default requestBlueTick;
