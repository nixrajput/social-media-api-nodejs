"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("@sendgrid/mail"));
const LocalConfig_1 = __importDefault(require("../config/LocalConfig"));
const logger_1 = __importDefault(require("../logger"));
const strings_1 = __importDefault(require("../constants/strings"));
class MailServiceHelper {
    static async sendEmail({ to, cc, bcc, subject, textContent, htmlContent, category, content, }) {
        const sendgridApiKey = LocalConfig_1.default.getConfig().SENDGRID_API_KEY;
        const smtpFrom = LocalConfig_1.default.getConfig().SMTP_FROM;
        if (!sendgridApiKey) {
            logger_1.default.getInstance().error("Env :: SendGrid API key not found");
            throw new Error("SendGrid API key not found in ENV file");
        }
        if (!smtpFrom) {
            logger_1.default.getInstance().error("Env :: SMTP From not found");
            throw new Error("SMTP From not found in ENV file");
        }
        mail_1.default.setApiKey(sendgridApiKey);
        if (!to) {
            logger_1.default.getInstance().error("Mail reciever is required");
            throw new Error("Mail reciever is required");
        }
        if (!subject) {
            logger_1.default.getInstance().error("Mail subject is required");
            throw new Error("Mail subject is required");
        }
        if (!htmlContent && !textContent && !content) {
            logger_1.default.getInstance().error("Mail content is required");
            throw new Error("Mail content is required");
        }
        logger_1.default.getInstance().info("SendGrid :: Sending email...");
        if (textContent) {
            return await mail_1.default
                .send({
                to: to,
                cc: cc,
                bcc: bcc,
                from: smtpFrom,
                subject: subject,
                text: textContent,
                category: category,
            })
                .then((result) => {
                logger_1.default.getInstance().info(result);
                logger_1.default.getInstance().info(`${strings_1.default.EMAIL_SEND_SUCCESS} to ${to}`);
            }, (err) => {
                logger_1.default.getInstance().error(err);
                if (err.response) {
                    throw new Error(err.response.body.errors[0].message);
                }
            });
        }
        else if (htmlContent) {
            return await mail_1.default
                .send({
                to: to,
                cc: cc,
                bcc: bcc,
                from: smtpFrom,
                subject: subject,
                html: htmlContent,
                category: category,
            })
                .then((result) => {
                logger_1.default.getInstance().info(result);
                logger_1.default.getInstance().info(`${strings_1.default.EMAIL_SEND_SUCCESS} to ${to}`);
            }, (err) => {
                logger_1.default.getInstance().error(err);
                if (err.response) {
                    throw new Error(err.response.body.errors[0].message);
                }
            });
        }
        else if (content) {
            return await mail_1.default
                .send({
                to: to,
                cc: cc,
                bcc: bcc,
                from: smtpFrom,
                subject: subject,
                content: content,
                category: category,
            })
                .then((result) => {
                logger_1.default.getInstance().info(result);
                logger_1.default.getInstance().info(`${strings_1.default.EMAIL_SEND_SUCCESS} to ${to}`);
            }, (err) => {
                logger_1.default.getInstance().error(err);
                if (err.response) {
                    throw new Error(err.response.body.errors[0].message);
                }
            });
        }
    }
}
exports.default = MailServiceHelper;
//# sourceMappingURL=MailServiceHelper.js.map