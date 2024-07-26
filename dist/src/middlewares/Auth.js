"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = __importDefault(require("../constants/statusCodes"));
const strings_1 = __importDefault(require("../constants/strings"));
const ApiError_1 = __importDefault(require("../exceptions/ApiError"));
const User_1 = __importDefault(require("../models/User"));
const TokenServiceHelper_1 = __importDefault(require("../helpers/TokenServiceHelper"));
class AuthMiddleware {
    static async isAuthenticatedUser(req, res, next) {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return next(new ApiError_1.default(strings_1.default.AUTH_PARAM_HEADER_NOT_FOUND, statusCodes_1.default.UNAUTHORIZED));
        }
        const token = authorization.split(" ")[1];
        if (!token) {
            return next(new ApiError_1.default(strings_1.default.TOKEN_NOT_FOUND_IN_AUTH_HEADER, statusCodes_1.default.UNAUTHORIZED));
        }
        const decodedToken = await TokenServiceHelper_1.default.verifyToken(token);
        if (!decodedToken) {
            return next(new ApiError_1.default(strings_1.default.TOKEN_NOT_VERIFIED, statusCodes_1.default.UNAUTHORIZED));
        }
        const isExpired = await decodedToken.isExpired();
        if (isExpired) {
            res.status(statusCodes_1.default.UNAUTHORIZED);
            return res.json({
                success: false,
                error: strings_1.default.TOKEN_EXPIRED,
                isExpired: isExpired,
            });
        }
        const reqUser = await User_1.default.findById(decodedToken.userId);
        if (!reqUser) {
            return next(new ApiError_1.default(strings_1.default.USER_NOT_FOUND, statusCodes_1.default.NOT_FOUND));
        }
        req.currentUser = reqUser;
        next();
    }
}
exports.default = AuthMiddleware;
//# sourceMappingURL=Auth.js.map