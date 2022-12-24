import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import validators from "../../../../utils/validators.js";
import utility from "../../../../utils/utility.js";
import models from "../../../../models/index.js";

/// SEND OTP ///

const sendOtpToEmail = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorHandler(ResponseMessages.EMAIL_REQUIRED, 400));
    }

    if (email && !validators.validateEmail(email)) {
        return next(new ErrorHandler(ResponseMessages.INVALID_EMAIL, 400));
    }

    // Generating OTP
    const { otp, expiresAt } = await utility.generateOTP();

    await models.OTP.create({
        otp,
        expiresAt,
        email,
    });

    const htmlMessage = `<p>Your OTP is:</p>
    <h2>${otp}</h2>
    <p>This OTP is valid for 15 minutes & usable once.</p>
    <p>If you have not requested this email then, please ignore it.</p>
    <p>
    For any queries, feel free to contact us at
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
            email: email,
            subject: `OTP From NixLab`,
            htmlMessage: htmlMessage,
        });

        res.status(200).json({
            success: true,
            message: ResponseMessages.OTP_SEND_SUCCESS,
        });
    } catch (err) {
        return next(new ErrorHandler(err.message, 400));
    }
});

export default sendOtpToEmail;
