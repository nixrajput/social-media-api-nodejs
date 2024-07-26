"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const otp_generator_1 = __importDefault(require("otp-generator"));
const Otp_1 = __importDefault(require("../models/Otp"));
class OtpServiceHelper {
    static async generateOtpFromEmail(email, options) {
        const otp = otp_generator_1.default.generate(options?.size || 6, {
            lowerCaseAlphabets: options?.useLowerCaseAlphabets || false,
            upperCaseAlphabets: options?.useUpperCaseAlphabets || false,
            specialChars: options?.useSpecialChars || false,
        });
        const expiresAt = Date.now() + (options?.expireIn || 15) * 60 * 1000;
        const otpModel = await Otp_1.default.create({
            otp: otp,
            expiresAt: expiresAt,
            email: email,
        });
        return otpModel;
    }
}
exports.default = OtpServiceHelper;
//# sourceMappingURL=OtpServiceHelper.js.map