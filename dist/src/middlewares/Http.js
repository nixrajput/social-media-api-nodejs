"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = __importDefault(require("../logger"));
class Http {
    static mount(_express) {
        logger_1.default.getInstance().info("App :: Registering HTTP middleware...");
        _express.use((0, cors_1.default)());
        _express.use((0, helmet_1.default)());
        _express.use((0, compression_1.default)());
        _express.use((0, express_1.json)({ limit: "100mb" }));
        _express.use((0, express_1.urlencoded)({ extended: true, limit: "100mb" }));
        _express.use(body_parser_1.default.json({ limit: "100mb" }));
        _express.use(body_parser_1.default.urlencoded({ extended: true, limit: "100mb" }));
        _express.set("trust proxy", true);
        return _express;
    }
}
exports.default = Http;
//# sourceMappingURL=Http.js.map