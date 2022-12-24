import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// VERIFY PASSWORD ///

const verifyPassword = catchAsyncError(async (req, res, next) => {
    const password = req.body.password;

    if (!password) {
        return next(new ErrorHandler(ResponseMessages.PASSWORD_REQUIRED, 400));
    }

    const user = await models.User.findById(req.user._id).select("password");

    const isPasswordMatched = await user.matchPassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler(ResponseMessages.INCORRECT_PASSWORD, 400));
    }

    res.status(200).json({
        success: true,
        message: ResponseMessages.CORRECT_PASSWORD,
    });
});

export default verifyPassword;
