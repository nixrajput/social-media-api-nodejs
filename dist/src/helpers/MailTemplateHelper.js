"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("src/logger"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const filePath = path_1.default.join(__dirname, "../emails/", "otp-email.html");
class EmailTemplateHelper {
    static async getOtpEmail(otp, name) {
        return new Promise((resolve, reject) => {
            fs_1.default.readFile(filePath, { encoding: "utf-8" }, function (err, data) {
                if (err) {
                    logger_1.default.getInstance().error(err.message);
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
exports.default = EmailTemplateHelper;
//# sourceMappingURL=MailTemplateHelper.js.map