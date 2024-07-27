"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("../logger"));
class Morgan {
    static _stream = {
        write: (message) => logger_1.default.getInstance().http(message.trim()),
    };
    static _format = ":remote-addr :method :url :status :res[content-length] - :response-time ms";
    static mount(_express) {
        logger_1.default.getInstance().info("App :: Registering Morgan middleware...");
        _express.use((0, morgan_1.default)(this._format, { stream: this._stream }));
        return _express;
    }
}
exports.default = Morgan;
//# sourceMappingURL=Morgan.js.map