import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import ResponseMessages from "../../../../contants/responseMessages.js";
import models from "../../../../models/index.js";
import validators from "../../../../utils/validators.js";

/// @route   POST api/v1/request-verification

const requestVerification = catchAsyncError(async (req, res, next) => {
    let {
        legalName, email, phone, category,
        document, isVerifiedOnOtherPlatform,
        otherPlatformLinks, hasWikipediaPage,
        wikipediaPageLink, featuredInArticles,
        articleLinks, otherLinks
    } = req.body;

    if (!legalName) {
        return next(new ErrorHandler(ResponseMessages.LEGAL_NAME_REQUIRED, 400));
    }

    if (legalName && !validators.validateName(legalName)) {
        return next(new ErrorHandler(ResponseMessages.INVALID_LEGAL_NAME, 400));
    }

    if (!email) {
        return next(new ErrorHandler(ResponseMessages.EMAIL_REQUIRED, 400));
    }

    if (email && !validators.validateEmail(email)) {
        return next(new ErrorHandler(ResponseMessages.INVALID_EMAIL, 400));
    }

    if (!phone) {
        return next(new ErrorHandler(ResponseMessages.PHONE_REQUIRED, 400));
    }

    if (phone && !validators.validatePhone(phone)) {
        return next(new ErrorHandler(ResponseMessages.INVALID_PHONE, 400));
    }

    if (!category) {
        return next(new ErrorHandler(ResponseMessages.CATEGORY_REQUIRED, 400));
    }

    if (!document) {
        return next(new ErrorHandler(ResponseMessages.DOCUMENT_REQUIRED, 400));
    }

    if (document) {
        if (!document.public_id) {
            return next(new ErrorHandler(ResponseMessages.PUBLIC_ID_REQUIRED, 400));
        }

        if (!document.url) {
            return next(new ErrorHandler(ResponseMessages.URL_REQUIRED, 400));
        }

        if (!validators.validateUrl(document.url)) {
            return next(new ErrorHandler(ResponseMessages.INVALID_URL, 400));
        }
    }

    if (!isVerifiedOnOtherPlatform) {
        return next(new ErrorHandler(ResponseMessages.IS_VERIFIED_ON_OTHER_PLATFORM_REQUIRED, 400));
    }

    if (isVerifiedOnOtherPlatform === "yes") {
        if (!otherPlatformLinks) {
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

    const isALreadyRequested = await models.VerificationRequest.findOne({
        user: req.user._id
    });

    if (isALreadyRequested) {
        return next(new ErrorHandler(ResponseMessages.ALREADY_REQUESTED, 400));
    }

    const user = await models.User.findById(req.user._id);

    if (!user) {
        return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
    }

    if ((user.email && user.emailVerified === false) || (user.phone && user.phoneVerified === false) || !user.avatar) {
        return next(new ErrorHandler(ResponseMessages.INELIGIBLE_FOR_VERIFICATION, 400));
    }

    if (user.avatar && !user.avatar.public_id && !user.avatar.url) {
        return next(new ErrorHandler(ResponseMessages.INELIGIBLE_FOR_VERIFICATION, 400));
    }

    const blueTickRequest = await models.VerificationRequest.create({
        user: req.user._id,
        legalName,
        email,
        phone,
        category,
        document,
        isVerifiedOnOtherPlatform,
        otherPlatformLinks,
        hasWikipediaPage,
        wikipediaPageLink,
        featuredInArticles,
        articleLinks,
        otherLinks
    });

    user.verificationRequestedAt = Date.now();
    await user.save();

    res.status(200).json({
        success: true,
        message: ResponseMessages.VERIFICATION_REQUEST_SUCCESS,
        request: blueTickRequest,
    });
});

export default requestVerification;
