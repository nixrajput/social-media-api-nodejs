"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("../config/env"));
const logger_1 = __importDefault(require("../logger"));
const ApiError_1 = __importDefault(require("../exceptions/ApiError"));
const statusCodes_1 = __importDefault(require("../constants/statusCodes"));
const strings_1 = __importDefault(require("../constants/strings"));
class ExceptionHandler {
    static notFoundHandler(_express) {
        _express.use("*", (req, res) => {
            const url = req.originalUrl;
            if (url === "/") {
                return res.status(200).json({
                    success: true,
                    server: "online",
                    timestamp: new Date(),
                    message: "Server is up and running...",
                });
            }
            const ip = req.headers["x-forwarded-for"] ||
                req.headers["x-real-ip"] ||
                req.socket.remoteAddress;
            logger_1.default.getInstance().error(`${ip} Path '${url}' not found!`);
            return res.status(404).json({
                success: false,
                server: "online",
                method: req.method,
                timestamp: new Date(),
                error: "Path not found",
            });
        });
        return _express;
    }
    static clientErrorHandler(err, req, res, next) {
        logger_1.default.getInstance().error(err.stack);
        if (req.xhr) {
            return res.status(500).send({ error: "Something went wrong!" });
        }
        else {
            return next(err);
        }
    }
    static errorHandler(err, req, res, _next) {
        err.statusCode = err.statusCode || statusCodes_1.default.INTERNAL_SERVER_ERROR;
        err.message = err.message || strings_1.default.INTERNAL_SERVER_ERROR;
        const apiPrefix = env_1.default.getConfig().API_PREFIX;
        console.log(req.originalUrl);
        if (req.originalUrl.includes(`/${apiPrefix}/`)) {
            if (err.name && err.name === "UnauthorizedError") {
                const message = strings_1.default.INVALID_TOKEN;
                err = new ApiError_1.default(message, statusCodes_1.default.UNAUTHORIZED);
            }
            if (err.name === "CastError") {
                const message = strings_1.default.RESOURCE_NOT_FOUND;
                err = new ApiError_1.default(message, statusCodes_1.default.NOT_FOUND);
            }
            if (err.name === "jsonWebTokenError") {
                const message = strings_1.default.INVALID_TOKEN;
                err = new ApiError_1.default(message, statusCodes_1.default.UNAUTHORIZED);
            }
            if (err.name === "TokenExpiredError") {
                const message = strings_1.default.TOKEN_EXPIRED;
                err = new ApiError_1.default(message, statusCodes_1.default.UNAUTHORIZED);
            }
            logger_1.default.getInstance().error(err.message);
            return res.status(err.statusCode).json({
                success: false,
                error: err.message,
            });
        }
        return res.render("pages/error", {
            error: err.message,
            title: "Under Maintenance",
        });
    }
    static logErrors(err, _req, _res, next) {
        logger_1.default.getInstance().error(err.stack);
        return next(err);
    }
}
exports.default = ExceptionHandler;
//# sourceMappingURL=Handler.js.map