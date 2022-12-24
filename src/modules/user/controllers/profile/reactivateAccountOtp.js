import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import models from "../../../../models/index.js";
import ResponseMessages from "../../../../contants/responseMessages.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import utility from "../../../../utils/utility.js";

/// SEND REACTIVATE ACCOUNT OTP ///

const reactivateAccountOtp = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || email === "") {
        return next(new ErrorHandler(ResponseMessages.EMAIL_REQUIRED, 400));
    }

    if (!password || password === "") {
        return next(new ErrorHandler(ResponseMessages.PASSWORD_REQUIRED, 400));
    }

    const user = await models.User.findOne({ email })
        .select("_id password accountStatus fname email");

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorHandler(ResponseMessages.INCORRECT_PASSWORD, 400));
    }

    if (user.accountStatus === "active" || user.accountStatus !== "deactivated") {
        return next(new ErrorHandler(ResponseMessages.ACCOUNT_ALREADY_ACTIVE, 400));
    }

    // Generating OTP
    const { otp, expiresAt } = await utility.generateOTP();

    await models.OTP.create({
        otp,
        expiresAt,
        user: user._id,
    });

    const htmlMessage = `<p>Hi ${user.fname},</p>
    <p>Your OTP for reactivating your account is:</p>
    <h2>${otp}</h2>
    <p>This OTP is valid for 15 minutes & usable once.</p>
    <p>If you have not requested this email then, please ignore it.</p>
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
            subject: `Account Reactivation OTP`,
            htmlMessage: htmlMessage,
        });
    } catch (err) {
        console.log(err);
    }

    res.status(200).json({
        success: true,
        message: ResponseMessages.OTP_SEND_SUCCESS,
    });
});

export default reactivateAccountOtp;
