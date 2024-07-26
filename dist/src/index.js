"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./logger"));
const main = () => {
    logger_1.default.getInstance().info("App :: Starting...");
    app_1.default._init();
};
main();
//# sourceMappingURL=index.js.map