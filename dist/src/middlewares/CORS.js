"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const logger_1 = __importDefault(require("../logger"));
class CORS {
    corsOptions = {
        origin: "*",
        optionsSuccessStatus: 200,
        methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
        credentials: true,
        exposedHeaders: ["x-auth-token"],
    };
    mount(_express) {
        logger_1.default.getInstance().info("App :: Registering CORS middleware...");
        _express.use((0, cors_1.default)(this.corsOptions));
        return _express;
    }
}
exports.default = new CORS();
//# sourceMappingURL=CORS.js.map