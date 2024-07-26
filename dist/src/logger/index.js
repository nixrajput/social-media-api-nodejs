"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
};
winston_1.default.addColors(colors);
let _consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }), winston_1.default.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
}));
if (process.env.NODE_ENV !== "development") {
    _consoleFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }), winston_1.default.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
    }));
}
const transports = [
    new winston_1.default.transports.Console({
        handleExceptions: true,
        format: _consoleFormat,
    }),
];
class Logger {
    static instance;
    constructor() { }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = winston_1.default.createLogger({
                level: "debug",
                levels,
                transports,
            });
        }
        return Logger.instance;
    }
    static _init() {
        Logger.instance = winston_1.default.createLogger({
            level: "debug",
            levels,
            transports,
        });
    }
}
exports.default = Logger;
//# sourceMappingURL=index.js.map