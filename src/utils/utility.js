import sgMail from "@sendgrid/mail";
import optGenerator from "otp-generator";
import models from "../models/index.js";
import dates from "./dateFunc.js";
import ErrorHandler from "../helpers/errorHandler.js";

const utility = {};

// Check Username Availability
utility.checkUsernameAvailable = async (uname) => {
  let user = await models.User.findOne({ uname });

  if (user) {
    return false;
  }

  return true;
};

// Delete All expired OTPs
utility.deleteExpiredOTPs = async () => {
  const otps = await models.OTP.find();

  for (let i = 0; i < otps.length; i++) {
    if (dates.compare(otps[i].expiresAt, new Date()) === -1) {
      await otps[i].remove();
    }
  }

  console.log("[cron] task has deleted expired OTPs.");
};

utility.sendEmail = async (options) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: options.email, // Change to your recipient
    from: process.env.SMTP_FROM, // Change to your verified sender
    subject: options.subject,
    text: options.message,
    html: options.htmlMessage,
  };

  await sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.log(error.message);
      console.error(error);
    });
};

utility.generateOTP = async (size = 6, expireTimeInMin = 15) => {
  const options = {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  };

  // Generating Token
  const otp = optGenerator.generate(size, options);

  // Valid for 15 minutes
  const expiresAt = Date.now() + expireTimeInMin * 60 * 1000;

  return { otp, expiresAt };
};

utility.checkUserAccountStatus = async (status) => {
  if (status === "deleted") {
    return "account has been deleted";
  }

  if (status === "suspended") {
    return "account has been suspended";
  }

  if (status === "deactivated") {
    return "account has been deactivated";
  }
};

export default utility;
