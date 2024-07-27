"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
class FirebaseConfig {
    static getConfig() {
        const config = {
            FIREBASE_TYPE: process.env["FIREBASE_TYPE"],
            FIREBASE_PROJECT_ID: process.env["FIREBASE_PROJECT_ID"],
            FIREBASE_PRIVATE_KEY_ID: process.env["FIREBASE_PRIVATE_KEY_ID"],
            FIREBASE_PRIVATE_KEY: process.env["FIREBASE_PRIVATE_KEY"].replace(/\\n/g, ""),
            FIREBASE_CLIENT_EMAIL: process.env["FIREBASE_CLIENT_EMAIL"],
            FIREBASE_CLIENT_ID: process.env["FIREBASE_CLIENT_ID"],
            FIREBASE_AUTH_URI: process.env["FIREBASE_AUTH_URI"],
            FIREBASE_TOKEN_URI: process.env["FIREBASE_TOKEN_URI"],
            FIREBASE_AUTH_PROVIDER_X509_CERT_URL: process.env["FIREBASE_AUTH_PROVIDER_X509_CERT_URL"],
            FIREBASE_CLIENT_X509_CERT_URL: process.env["FIREBASE_CLIENT_X509_CERT_URL"],
        };
        for (const [key, value] of Object.entries(config)) {
            if (value === undefined) {
                throw new Error(`Missing key ${key} in Environmental variables`);
            }
        }
        return config;
    }
    static init(_express) {
        _express.locals["app"] = this.getConfig();
        logger_1.default.getInstance().info("Firebase Config :: Loaded");
        return _express;
    }
}
exports.default = FirebaseConfig;
//# sourceMappingURL=firebase.js.map