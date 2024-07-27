"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const env_1 = __importDefault(require("../config/env"));
const logger_1 = __importDefault(require("../logger"));
const Handler_1 = __importDefault(require("../exceptions/Handler"));
const Http_1 = __importDefault(require("../middlewares/Http"));
const CORS_1 = __importDefault(require("../middlewares/CORS"));
const Morgan_1 = __importDefault(require("../middlewares/Morgan"));
const app_routes_1 = __importDefault(require("./app-routes"));
const firebase_1 = __importDefault(require("../config/firebase"));
const swagger_1 = __importDefault(require("../config/swagger"));
const db_1 = require("../config/db");
class ExpressApp {
    express;
    _server;
    constructor() {
        logger_1.default.getInstance().info("App :: Initializing...");
        this.express = (0, express_1.default)();
        this.mountLogger();
        this.mountDotEnv();
        this.mountMiddlewares();
        this.mouteRoutes();
        this.mountSwagger();
        this.registerHandlers();
        this.connectToDB();
        logger_1.default.getInstance().info("App :: Initialized");
    }
    mountDotEnv() {
        logger_1.default.getInstance().info("Config :: Loading...");
        this.express = env_1.default.init(this.express);
        this.express = firebase_1.default.init(this.express);
    }
    mountLogger() {
        logger_1.default._init();
        logger_1.default.getInstance().info("Logger :: Mounted");
    }
    mountSwagger() {
        logger_1.default.getInstance().info("Swagger :: Initializing...");
        this.express = swagger_1.default.init(this.express);
    }
    mountMiddlewares() {
        logger_1.default.getInstance().info("App :: Registering middlewares...");
        this.express = Http_1.default.mount(this.express);
        this.express = Morgan_1.default.mount(this.express);
        if (env_1.default.getConfig().CORS_ENABLED) {
            this.express = CORS_1.default.mount(this.express);
        }
        logger_1.default.getInstance().info("App :: Middlewares registered");
    }
    registerHandlers() {
        logger_1.default.getInstance().info("App :: Registering handlers...");
        this.express.use(Handler_1.default.logErrors);
        this.express.use(Handler_1.default.clientErrorHandler);
        this.express.use(Handler_1.default.errorHandler);
        this.express = Handler_1.default.notFoundHandler(this.express);
        logger_1.default.getInstance().info("App :: Handlers registered");
    }
    mouteRoutes() {
        this.express = app_routes_1.default.mountApi(this.express);
        logger_1.default.getInstance().info("Routes :: API routes mounted");
    }
    connectToDB() {
        logger_1.default.getInstance().info("Database :: Connecting...");
        db_1.MongoDB.getInstance().connect();
    }
    _init() {
        logger_1.default.getInstance().info("Server :: Starting...");
        const port = env_1.default.getConfig().PORT || 5000;
        this._server = this.express
            .listen(port, () => {
            logger_1.default.getInstance().info(`Server :: Running @ 'http://localhost:${port}'`);
        })
            .on("error", (_error) => {
            logger_1.default.getInstance().error("Error: ", _error.message);
        });
        logger_1.default.getInstance().info("App :: Started");
    }
    _close() {
        logger_1.default.getInstance().info("Server :: Stopping server...");
        this._server.close(function () {
            process.exit(1);
        });
    }
}
exports.default = new ExpressApp();
//# sourceMappingURL=index.js.map