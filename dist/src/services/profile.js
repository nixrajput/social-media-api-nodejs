"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("src/logger"));
class ProfileService {
    getProfileExc = async (currentUser) => {
        try {
            return Promise.resolve(currentUser);
        }
        catch (error) {
            logger_1.default.getInstance().error("ProfileService: getProfileExc", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
}
exports.default = ProfileService;
//# sourceMappingURL=profile.js.map