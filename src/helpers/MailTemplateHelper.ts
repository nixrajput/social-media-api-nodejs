import Logger from "../logger";
import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "../emails/", "otp-email.html");

class EmailTemplateHelper {
  public static async getOtpEmail(otp: string, name?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, { encoding: "utf-8" }, function (err, data) {
        if (err) {
          Logger.error(err.message);
          reject(err);
        }

        const htmlString = data
          .replace("#__otp__#", otp)
          .replace("#__name__#", name || "User");
        resolve(htmlString);
      });
    });
  }
}

export default EmailTemplateHelper;
