"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strings_1 = __importDefault(require("../constants/strings"));
const logger_1 = __importDefault(require("src/logger"));
const Post_1 = __importDefault(require("../models/Post"));
class PostService {
    findAllExc = async ({ findParams, sortParams, page, limit, skip, currentUser, }) => {
        try {
            if (Object.keys(sortParams).length > 0) {
                sortParams = {
                    ...sortParams,
                    createdAt: -1,
                };
            }
            else {
                sortParams = { createdAt: -1 };
            }
            const pipeline = [
                { $match: findParams },
                { $sort: sortParams },
                {
                    $lookup: {
                        from: "recruiterprofiles",
                        localField: "recruiterId",
                        foreignField: "userId",
                        pipeline: [
                            {
                                $project: {
                                    _id: 1,
                                    userId: 1,
                                    companyName: 1,
                                    website: 1,
                                    logoUrl: 1,
                                    about: 1,
                                    address: 1,
                                    createdAt: 1,
                                    updatedAt: 1,
                                },
                            },
                        ],
                        as: "recruiter",
                    },
                },
                { $unwind: "$recruiter" },
                {
                    $lookup: {
                        from: "jobapplications",
                        let: { job_id: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$jobId", "$$job_id"] },
                                            { $eq: ["$userId", currentUser?._id] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "yourApplications",
                    },
                },
                {
                    $facet: {
                        total: [{ $count: "count" }],
                        data: [
                            {
                                $addFields: {
                                    _id: "$_id",
                                    isApplied: { $anyElementTrue: ["$yourApplications"] },
                                },
                            },
                            {
                                $project: { yourApplications: 0, __v: 0 },
                            },
                        ],
                    },
                },
                { $unwind: "$total" },
                {
                    $project: {
                        currentPage: {
                            $literal: skip / limit + 1,
                        },
                        hasNextPage: {
                            $lt: [{ $multiply: [limit, Number(page)] }, "$total.count"],
                        },
                        totalPages: {
                            $ceil: {
                                $divide: ["$total.count", limit],
                            },
                        },
                        totalItems: "$total.count",
                        results: {
                            $slice: ["$data", skip, { $ifNull: [limit, "$total.count"] }],
                        },
                    },
                },
            ];
            const aggResponse = await Post_1.default.aggregate(pipeline);
            let response = {
                currentPage: 1,
                hasNextPage: false,
                totalPages: 1,
                totalItems: 0,
                results: [],
            };
            if (aggResponse.length > 0) {
                response = aggResponse[0];
            }
            return Promise.resolve(response);
        }
        catch (error) {
            logger_1.default.getInstance().error("PostService: findAllExc", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
    findByIdExc = async (id) => {
        try {
            const job = await Post_1.default.findById(id);
            if (!job) {
                return Promise.reject(strings_1.default.POST_NOT_FOUND);
            }
            return Promise.resolve(job);
        }
        catch (error) {
            logger_1.default.getInstance().error("PostService: findByIdExc", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
}
exports.default = PostService;
//# sourceMappingURL=post.js.map