"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../enums");
const ApiError_1 = __importDefault(require("../../exceptions/ApiError"));
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const strings_1 = __importDefault(require("../../constants/strings"));
const logger_1 = __importDefault(require("../../logger"));
class ProfileController {
    getProfileDetails = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.GET) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        try {
            return res.status(statusCodes_1.default.CREATED).json({
                success: true,
                message: strings_1.default.SUCCESS,
                data: {},
            });
        }
        catch (error) {
            const errorMessage = error?.message || error || strings_1.default.SOMETHING_WENT_WRONG;
            logger_1.default.getInstance().error("ProfileController: getProfileDetails", "errorInfo:" + JSON.stringify(error));
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: errorMessage,
            });
        }
    };
}
exports.default = ProfileController;
//# sourceMappingURL=profile.js.map