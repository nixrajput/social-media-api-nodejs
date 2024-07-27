"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const logger_1 = __importDefault(require("../logger"));
const strings_1 = __importDefault(require("../constants/strings"));
const AuthToken_1 = __importDefault(require("../models/AuthToken"));
class TokenServiceHelper {
    static async verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.default.getConfig().JWT_SECRET);
            if (!decoded || typeof decoded === "string") {
                throw new Error(strings_1.default.TOKEN_NOT_VERIFIED);
            }
            const authToken = await AuthToken_1.default.findOne({
                token: token,
                userId: decoded.id,
            });
            if (!authToken) {
                logger_1.default.getInstance().error(strings_1.default.TOKEN_NOT_FOUND);
                return null;
            }
            return authToken;
        }
        catch (error) {
            logger_1.default.getInstance().error(error.message);
            return null;
        }
    }
    static async isTokenExpired(expiresAt) {
        if (expiresAt < new Date().getTime() / 1000) {
            return true;
        }
        return false;
    }
}
exports.default = TokenServiceHelper;
//# sourceMappingURL=TokenServiceHelper.js.map