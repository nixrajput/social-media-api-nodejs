import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import models from "../../../../models/index.js";
import ResponseMessages from "../../../../contants/responseMessages.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import utility from "../../../../utils/utility.js";
import dateUtility from "../../../../utils/dateUtil.js";

/// REACTIVATE ACCOUNT ///

const reactivateAccount = catchAsyncError(async (req, res, next) => {

    const { email, otp, password } = req.body;

    if (!email || email === "") {
        return next(new ErrorHandler(ResponseMessages.EMAIL_REQUIRED, 400));
    }

    if (!password || password === "") {
        return next(new ErrorHandler(ResponseMessages.PASSWORD_REQUIRED, 400));
    }

    if (!otp || otp === "") {
        return next(new ErrorHandler(ResponseMessages.OTP_REQUIRED, 400));
    }

    const otpObj = await models.OTP.findOne({ otp });

    if (!otpObj) {
        return next(new ErrorHandler(ResponseMessages.INCORRECT_OTP, 400));
    }

    if (otpObj.isUsed === true) {
        return next(new ErrorHandler(ResponseMessages.OTP_ALREADY_USED, 400));
    }

    if (dateUtility.compare(otpObj.expiresAt, new Date()) !== 1) {
        return next(new ErrorHandler(ResponseMessages.OTP_EXPIRED, 400));
    }

    const user = await models.User.findOne({ email })
        .select("password accountStatus fname email");

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorHandler(ResponseMessages.INCORRECT_PASSWORD, 400));
    }

    if (otpObj.user.toString() === user._id.toString()) {
        if (user.accountStatus === "active" || user.accountStatus !== "deactivated") {
            return next(new ErrorHandler(ResponseMessages.ACCOUNT_ALREADY_ACTIVE, 400));
        }

        user.accountStatus = "active";

        await models.Post.updateMany({ owner: user._id }, { isArchived: false });

        await user.save();

        const htmlMessage = `<p>Hi ${user.fname},</p>
          <p>Your account has been reactivated.</p>
          <p>If you did not reactivate your account, please contact us immediately.</p>
          <p>
            If you have any questions, feel free to contact us at
            <a href="mailto:nixlab.in@gmail.com" target="_blank">nixlab.in@gmail.com</a>.
          </p>
          <p> If you want know more about NixLab, please visit our website 
                <a href="https://www.nixlab.co.in" target="_blank">here</a>.
          </p>
          <p>This is a auto-generated email. Please do not reply to this email.</p>
          <p>
            Regards, <br />
            NixLab Technologies Team
          </p>`;

        try {
            await utility.sendEmail({
                email: user.email,
                subject: `Account Reactivated`,
                htmlMessage: htmlMessage,
            });
        } catch (err) {
            console.log(err);
        }

        res.status(200).json({
            success: true,
            message: ResponseMessages.ACCOUNT_REACTIVATE_SUCCESS,
        });
    }
    else {
        return next(new ErrorHandler(ResponseMessages.INCORRECT_OTP, 400));
    }
});

export default reactivateAccount;
