"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const logger_1 = __importDefault(require("../logger"));
class SwaggerDocs {
    static options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Social Media API",
                version: "1.0.0",
                description: "API documentation for the Social Media application",
                license: {
                    name: "MIT",
                    url: "https://spdx.org/licenses/MIT.html",
                },
                contact: {
                    name: "Nikhil Rajput",
                    url: "https://nixrajput.com",
                    email: "nkr.nikhil.nkr@gmail.com",
                },
            },
            servers: [{ url: "http://localhost:5000" }],
        },
        apis: process.env.NODE_ENV === "production"
            ? [
                "./src/routes/*.js",
                "./src/models/*.js",
                "./src/controllers/**/**.js",
            ]
            : [
                "./src/routes/*.ts",
                "./src/models/*.ts",
                "./src/controllers/**/**.ts",
            ],
    };
    static swaggerSpecs = (0, swagger_jsdoc_1.default)(this.options);
    static init(_express) {
        _express.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(this.swaggerSpecs, { explorer: true }));
        logger_1.default.getInstance().info("Swagger :: Initialized");
        return _express;
    }
}
exports.default = SwaggerDocs;
//# sourceMappingURL=swagger.js.map