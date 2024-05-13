/**
 * Define Mail Helper class
 */

import sgMail from "@sendgrid/mail";
import LocalConfig from "../configs/LocalConfig";
import Logger from "../logger";
import StringValues from "../constants/strings";

export interface MailTo {
  name: string;
  email: string;
}

export interface MailContent {
  type: string;
  value: string;
}

export interface MailOptions {
  to: string | string[] | MailTo[] | (string | MailTo)[];
  subject: string;
  cc?: string | string[] | MailTo[] | (string | MailTo)[];
  bcc?: string | string[] | MailTo[] | (string | MailTo)[];
  textContent?: string;
  htmlContent?: string;
  category?: string;
  content?: MailContent[] & { 0: MailContent };
}

class MailServiceHelper {
  /**
   * Send Single Email
   */
  public static async sendEmail({
    to,
    cc,
    bcc,
    subject,
    textContent,
    htmlContent,
    category,
    content,
  }: MailOptions): Promise<void> {
    const sendgridApiKey = LocalConfig.getConfig().SENDGRID_API_KEY!;
    const smtpFrom = LocalConfig.getConfig().SMTP_FROM!;

    if (!sendgridApiKey) {
      Logger.error("Env :: SendGrid API key not found");
      throw new Error("SendGrid API key not found in ENV file");
    }

    if (!smtpFrom) {
      Logger.error("Env :: SMTP From not found");
      throw new Error("SMTP From not found in ENV file");
    }

    /// Set API Key
    sgMail.setApiKey(sendgridApiKey);

    if (!to) {
      Logger.error("Mail reciever is required");
      throw new Error("Mail reciever is required");
    }

    if (!subject) {
      Logger.error("Mail subject is required");
      throw new Error("Mail subject is required");
    }

    if (!htmlContent && !textContent && !content) {
      Logger.error("Mail content is required");
      throw new Error("Mail content is required");
    }

    Logger.info("SendGrid :: Sending email...");

    if (textContent) {
      return await sgMail
        .send({
          to: to,
          cc: cc,
          bcc: bcc,
          from: smtpFrom,
          subject: subject,
          text: textContent,
          category: category,
        })
        .then(
          (result) => {
            Logger.info(result);
            Logger.info(`${StringValues.EMAIL_SEND_SUCCESS} to ${to}`);
          },
          (err) => {
            Logger.error(err);
            if (err.response) {
              throw new Error(err.response.body.errors[0].message);
            }
          }
        );
    } else if (htmlContent) {
      return await sgMail
        .send({
          to: to,
          cc: cc,
          bcc: bcc,
          from: smtpFrom,
          subject: subject,
          html: htmlContent,
          category: category,
        })
        .then(
          (result) => {
            Logger.info(result);
            Logger.info(`${StringValues.EMAIL_SEND_SUCCESS} to ${to}`);
          },
          (err) => {
            Logger.error(err);
            if (err.response) {
              throw new Error(err.response.body.errors[0].message);
            }
          }
        );
    } else if (content) {
      return await sgMail
        .send({
          to: to,
          cc: cc,
          bcc: bcc,
          from: smtpFrom,
          subject: subject,
          content: content,
          category: category,
        })
        .then(
          (result) => {
            Logger.info(result);
            Logger.info(`${StringValues.EMAIL_SEND_SUCCESS} to ${to}`);
          },
          (err) => {
            Logger.error(err);
            if (err.response) {
              throw new Error(err.response.body.errors[0].message);
            }
          }
        );
    }
  }
}

export default MailServiceHelper;
