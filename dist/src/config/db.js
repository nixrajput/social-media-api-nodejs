"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = __importDefault(require("./env"));
const logger_1 = __importDefault(require("../logger"));
class MongoDB {
    static instance;
    constructor() { }
    static getInstance() {
        if (!MongoDB.instance) {
            MongoDB.instance = new MongoDB();
        }
        return MongoDB.instance;
    }
    async connect() {
        try {
            await mongoose_1.default.connect(env_1.default.getConfig().MONGO_URI, {
                dbName: env_1.default.getConfig().DB_NAME,
                autoIndex: true,
                socketTimeoutMS: 30000,
                serverSelectionTimeoutMS: 5000,
            });
            logger_1.default.getInstance().info("Database :: Connected @ MongoDB");
            return true;
        }
        catch (error) {
            logger_1.default.getInstance().error(`Database :: Error: ${error.message}`);
            return false;
        }
    }
}
exports.MongoDB = MongoDB;
//# sourceMappingURL=db.js.map