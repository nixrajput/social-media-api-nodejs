/**
 * Define Post Service Class
 */

import type { PipelineStage } from "mongoose";
import StringValues from "../constants/strings";
import type { IUserModel } from "../interfaces/entities/user";
import type { IListResponse } from "../interfaces/responses/listResponse";
import Logger from "src/logger";
import type { IPost, IPostModel } from "../interfaces/entities/post";
import Post from "../models/Post";

class PostService {
  // Create Job Service
  //   public createExc = async (newjob: IJob): Promise<IJobModel> => {
  //     try {
  //       const job = await Job.create({
  //         recruiterId: newjob.recruiterId,
  //         title: newjob.title,
  //         mandatorySkills: newjob.mandatorySkills,
  //         optionalSkills: newjob.optionalSkills,
  //         salary: newjob.salary,
  //         currency: newjob.currency,
  //         hasProbationPeriod: newjob.hasProbationPeriod,
  //         probationDuration: newjob.probationDuration,
  //         probationSalary: newjob.probationSalary,
  //         jobType: newjob.jobType,
  //         location: newjob.location,
  //         isImmediateJoining: newjob.isImmediateJoining,
  //         preferredJoiningDate: newjob.preferredJoiningDate,
  //         workExperience: newjob.workExperience,
  //         openings: newjob.openings,
  //         extraBenefits: newjob.extraBenefits,
  //         description: newjob.description,
  //       });

  //       return Promise.resolve(job);
  //     } catch (error) {
  //       Logger.getInstance().error(
  //         "PostService: createExc",
  //         "errorInfo:" + JSON.stringify(error)
  //       );
  //       return Promise.reject(error);
  //     }
  //   };

  // Find All Posts Service
  public findAllExc = async ({
    findParams,
    sortParams,
    page,
    limit,
    skip,
    currentUser,
  }: {
    findParams?: Record<string, any>;
    sortParams?: Record<string, any>;
    page?: number;
    limit?: number;
    skip?: number;
    currentUser?: IUserModel;
  }): Promise<IListResponse<IPost>> => {
    try {
      // Defining Sort Params
      if (Object.keys(sortParams).length > 0) {
        sortParams = {
          ...sortParams,
          createdAt: -1,
        };
      } else {
        sortParams = { createdAt: -1 };
      }

      // Defining Pipeline Stage
      const pipeline: PipelineStage[] = [
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

      const aggResponse = await Post.aggregate(pipeline);

      let response: IListResponse<IPost> = {
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
    } catch (error) {
      Logger.getInstance().error(
        "PostService: findAllExc",
        "errorInfo:" + JSON.stringify(error)
      );
      return Promise.reject(error);
    }
  };

  // Find Post by Id
  public findByIdExc = async (id: string): Promise<IPostModel> => {
    try {
      const job = await Post.findById(id);

      if (!job) {
        return Promise.reject(StringValues.POST_NOT_FOUND);
      }

      return Promise.resolve(job);
    } catch (error) {
      Logger.getInstance().error(
        "PostService: findByIdExc",
        "errorInfo:" + JSON.stringify(error)
      );
      return Promise.reject(error);
    }
  };
}

export default PostService;
