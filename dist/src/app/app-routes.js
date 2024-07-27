"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("../config/env"));
const logger_1 = __importDefault(require("../logger"));
const auth_1 = __importDefault(require("../routes/auth"));
class Routes {
    mountApi(_express) {
        const apiPrefix = env_1.default.getConfig().API_PREFIX;
        logger_1.default.getInstance().info("Routes :: Mounting API routes...");
        _express.use(`/${apiPrefix}/auth`, auth_1.default);
        return _express;
    }
}
exports.default = new Routes();
//# sourceMappingURL=app-routes.js.map