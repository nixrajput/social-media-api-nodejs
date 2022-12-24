import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// DEACTIVATE ACCOUNT ///

const deactivateAccount = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || email === "") {
        return next(new ErrorHandler(ResponseMessages.EMAIL_REQUIRED, 400));
    }

    if (!password || password === "") {
        return next(new ErrorHandler(ResponseMessages.PASSWORD_REQUIRED, 400));
    }

    const user = await models.User.findOne({ email })
        .select("password accountStatus fname email");

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorHandler(ResponseMessages.INCORRECT_PASSWORD, 400));
    }

    if (req.user._id.toString() === user._id.toString()) {

        if (user.accountStatus !== "active" || user.accountStatus === "deactivated") {
            return next(new ErrorHandler(ResponseMessages.ACCOUNT_ALREADY_DEACTIVATED, 400));
        }

        await models.Post.updateMany({ owner: user._id }, { isArchived: true });

        user.accountStatus = "deactivated";
        await user.save();

        const htmlMessage = `<p>Hi ${user.fname},</p>
      <p>Your account has been deactivated.</p>
      <p>You can reactivate your account by logging in to your account.</p>
      <p>If you did not deactivate your account, please contact us immediately.</p>
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
                subject: `Account Deactivated`,
                htmlMessage: htmlMessage,
            });
        } catch (err) {
            console.log(err);
        }

        res.status(200).json({
            success: true,
            message: ResponseMessages.ACCOUNT_DEACTIVATE_SUCCESS,
        });
    } else {
        return next(new ErrorHandler(ResponseMessages.UNAUTHORIZED, 401));
    }
});

export default deactivateAccount;
