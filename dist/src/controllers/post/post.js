"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const enums_1 = require("../../enums");
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const strings_1 = __importDefault(require("../../constants/strings"));
const ApiError_1 = __importDefault(require("../../exceptions/ApiError"));
const logger_1 = __importDefault(require("../../logger"));
class PostController {
    postSvc;
    _postSvc;
    constructor(postSvc) {
        this.postSvc = postSvc;
        this._postSvc = postSvc;
    }
    getPostFeed = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.GET) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        let findParams = {};
        let sortParams = {};
        const reqQueries = req.query;
        const page = reqQueries["page"] ? parseInt(reqQueries["page"]) : 1;
        const limit = reqQueries["limit"] ? parseInt(reqQueries["limit"]) : 10;
        const skip = page - 1 >= 0 ? (page - 1) * limit : 0;
        try {
            if (reqQueries["q"]) {
                findParams = {
                    ...findParams,
                    title: {
                        $regex: new RegExp((0, lodash_1.escapeRegExp)(reqQueries["q"]), "i"),
                    },
                };
            }
            if (reqQueries["asc"]) {
                if (Array.isArray(reqQueries["asc"])) {
                    reqQueries["asc"].map((key) => {
                        sortParams = {
                            ...sortParams,
                            [key]: 1,
                        };
                    });
                }
                else {
                    sortParams = {
                        ...sortParams,
                        [reqQueries["asc"]]: 1,
                    };
                }
            }
            if (reqQueries["desc"]) {
                if (Array.isArray(reqQueries["desc"])) {
                    reqQueries["desc"].map((key) => {
                        sortParams = {
                            ...sortParams,
                            [key]: -1,
                        };
                    });
                }
                else {
                    sortParams = {
                        ...sortParams,
                        [reqQueries["desc"]]: -1,
                    };
                }
            }
            const finalResponse = await this._postSvc.findAllExc({
                findParams: findParams,
                sortParams: sortParams,
                page: page,
                limit: limit,
                skip: skip,
                currentUser: req.currentUser,
            });
            res.status(statusCodes_1.default.OK);
            return res.json({
                success: true,
                message: strings_1.default.SUCCESS,
                ...finalResponse,
            });
        }
        catch (error) {
            const errorMessage = error?.message || error || strings_1.default.SOMETHING_WENT_WRONG;
            logger_1.default.getInstance().error("PostController: getPostFeed", "errorInfo:" + JSON.stringify(error));
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: errorMessage,
            });
        }
    };
}
exports.default = PostController;
//# sourceMappingURL=post.js.map