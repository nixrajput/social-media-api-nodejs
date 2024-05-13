import { EHttpMethod } from "../../enums";
import StatusCodes from "../../constants/statusCodes";
import StringValues from "../../constants/strings";
import ApiError from "../../exceptions/ApiError";
import type { IRequest, IResponse, INext } from "../../interfaces/core/express";
import Logger from "../../logger";
import PostService from "../../services/PostService";

class PostController {
  private readonly _postSvc: PostService;

  constructor(readonly postSvc: PostService) {
    this._postSvc = postSvc;
  }

  // Create new Post
  // @route  POST /api/v1/post/create
  // public createPost = async (
  //   req: IRequest,
  //   res: IResponse,
  //   next: INext
  // ): Promise<any> => {
  //   if (req.method !== EHttpMethod.POST) {
  //     return next(
  //       new ApiError(StringValues.INVALID_REQUEST_METHOD, StatusCodes.NOT_FOUND)
  //     );
  //   }

  //   try {
  //     const currentUser = req.currentUser;

  //     const data: IJobBodyData = req.body;

  //     if (!data) {
  //       return next(
  //         new ApiError(StringValues.JOB_DATA_REQUIRED, StatusCodes.BAD_REQUEST)
  //       );
  //     }

  //     if (!data.title) {
  //       return next(
  //         new ApiError(StringValues.JOB_TITLE_REQUIRED, StatusCodes.BAD_REQUEST)
  //       );
  //     }

  //     if (!data.mandatorySkills) {
  //       return next(
  //         new ApiError(
  //           StringValues.JOB_MANDATORY_SKILLS_REQUIRED,
  //           StatusCodes.BAD_REQUEST
  //         )
  //       );
  //     }

  //     if (data.mandatorySkills.length < 1) {
  //       return next(
  //         new ApiError(
  //           StringValues.JOB_MANDATORY_SKILLS_REQUIRED,
  //           StatusCodes.BAD_REQUEST
  //         )
  //       );
  //     }

  //     if (data.mandatorySkills.length > 5) {
  //       return next(
  //         new ApiError(
  //           StringValues.JOB_MANDATORY_SKILLS_MAX_LIMIT_ERROR,
  //           StatusCodes.BAD_REQUEST
  //         )
  //       );
  //     }

  //     if (data.optionalSkills && data.optionalSkills.length > 10) {
  //       return next(
  //         new ApiError(
  //           StringValues.JOB_OPTIONAL_SKILLS_MAX_LIMIT_ERROR,
  //           StatusCodes.BAD_REQUEST
  //         )
  //       );
  //     }

  //     if (!data.salary) {
  //       return next(
  //         new ApiError(
  //           StringValues.JOB_SALARY_RANGE_REQUIRED,
  //           StatusCodes.BAD_REQUEST
  //         )
  //       );
  //     }

  //     if (!data.salary.minSalary) {
  //       return next(
  //         new ApiError(
  //           StringValues.JOB_MIN_SALARY_REQUIRED,
  //           StatusCodes.BAD_REQUEST
  //         )
  //       );
  //     }

  //     if (!data.salary.maxSalary) {
  //       return next(
  //         new ApiError(
  //           StringValues.JOB_MAX_SALARY_REQUIRED,
  //           StatusCodes.BAD_REQUEST
  //         )
  //       );
  //     }

  //     if (data.currency && !data.currency.code) {
  //       return next(
  //         new ApiError(
  //           StringValues.CURRENCY_CODE_REQUIRED,
  //           StatusCodes.BAD_REQUEST
  //         )
  //       );
  //     }

  //     if (data.currency && !data.currency.symbol) {
  //       return next(
  //         new ApiError(
  //           StringValues.CURRENCY_SYMBOL_REQUIRED,
  //           StatusCodes.BAD_REQUEST
  //         )
  //       );
  //     }

  //     if (data.hasProbationPeriod === true) {
  //       if (!data.probationDuration) {
  //         return next(
  //           new ApiError(
  //             StringValues.JOB_PROBATION_DURATION_REQUIRED,
  //             StatusCodes.BAD_REQUEST
  //           )
  //         );
  //       }

  //       if (!data.probationSalary) {
  //         return next(
  //           new ApiError(
  //             StringValues.JOB_PROBATION_SALARY_RANGE_REQUIRED,
  //             StatusCodes.BAD_REQUEST
  //           )
  //         );
  //       }

  //       if (!data.probationSalary.minSalary) {
  //         return next(
  //           new ApiError(
  //             StringValues.JOB_MIN_PROBATION_SALARY_REQUIRED,
  //             StatusCodes.BAD_REQUEST
  //           )
  //         );
  //       }

  //       if (!data.probationSalary.maxSalary) {
  //         return next(
  //           new ApiError(
  //             StringValues.JOB_MAX_PROBATION_SALARY_REQUIRED,
  //             StatusCodes.BAD_REQUEST
  //           )
  //         );
  //       }
  //     }

  //     if (!data.jobType) {
  //       return next(
  //         new ApiError(StringValues.JOB_TYPE_REQUIRED, StatusCodes.BAD_REQUEST)
  //       );
  //     }

  //     if (!data.location) {
  //       return next(
  //         new ApiError(
  //           StringValues.JOB_LOCATION_REQUIRED,
  //           StatusCodes.BAD_REQUEST
  //         )
  //       );
  //     }

  //     if (!data.location.city) {
  //       return next(
  //         new ApiError(
  //           StringValues.JOB_LOCATION_CITY_REQUIRED,
  //           StatusCodes.BAD_REQUEST
  //         )
  //       );
  //     }

  //     if (!data.location.state) {
  //       return next(
  //         new ApiError(
  //           StringValues.JOB_LOCATION_STATE_REQUIRED,
  //           StatusCodes.BAD_REQUEST
  //         )
  //       );
  //     }

  //     if (!data.location.country) {
  //       return next(
  //         new ApiError(
  //           StringValues.JOB_LOCATION_COUNTRY_REQUIRED,
  //           StatusCodes.BAD_REQUEST
  //         )
  //       );
  //     }

  //     if (data.isImmediateJoining === false && !data.preferredJoiningDate) {
  //       return next(
  //         new ApiError(
  //           StringValues.JOB_PREFERRED_JOINING_DATE_REQUIRED,
  //           StatusCodes.BAD_REQUEST
  //         )
  //       );
  //     }

  //     if (!data.workExperience) {
  //       return next(
  //         new ApiError(
  //           StringValues.JOB_WORK_EXPERIENCE_REQUIRED,
  //           StatusCodes.BAD_REQUEST
  //         )
  //       );
  //     }

  //     if (!data.workExperience.minExperience) {
  //       return next(
  //         new ApiError(
  //           StringValues.JOB_MIN_WORK_EXPERIENCE_REQUIRED,
  //           StatusCodes.BAD_REQUEST
  //         )
  //       );
  //     }

  //     if (!data.workExperience.maxExperience) {
  //       return next(
  //         new ApiError(
  //           StringValues.JOB_MAX_WORK_EXPERIENCE_REQUIRED,
  //           StatusCodes.BAD_REQUEST
  //         )
  //       );
  //     }

  //     if (!data.openings) {
  //       return next(
  //         new ApiError(
  //           StringValues.JOB_OPENINGS_REQUIRED,
  //           StatusCodes.BAD_REQUEST
  //         )
  //       );
  //     }

  //     if (!data.description) {
  //       return next(
  //         new ApiError(
  //           StringValues.JOB_DESCRIPTION_REQUIRED,
  //           StatusCodes.BAD_REQUEST
  //         )
  //       );
  //     }

  //     const newJobData: IJob = {
  //       recruiterId: currentUser._id,
  //       title: data.title,
  //       mandatorySkills: data.mandatorySkills,
  //       optionalSkills: data.optionalSkills,
  //       salary: data.salary,
  //       currency: data.currency,
  //       hasProbationPeriod: data.hasProbationPeriod,
  //       probationDuration: data.probationDuration,
  //       probationSalary: data.probationSalary,
  //       jobType: data.jobType,
  //       location: data.location,
  //       isImmediateJoining: data.isImmediateJoining,
  //       preferredJoiningDate: data.preferredJoiningDate,
  //       workExperience: data.workExperience,
  //       openings: data.openings,
  //       extraBenefits: data.extraBenefits,
  //       description: data.description,
  //     };

  //     const job = await this._postSvc.createExc(newJobData);

  //     userProfile.jobPostsCount++;
  //     await userProfile.save();

  //     return res.status(StatusCodes.CREATED).json({
  //       success: true,
  //       message: StringValues.SUCCESS,
  //       data: job,
  //     });
  //   } catch (error: any) {
  //     const errorMessage =
  //       error?.message || error || StringValues.SOMETHING_WENT_WRONG;

  //     Logger.error(
  //       "JobController: createJob",
  //       "errorInfo:" + JSON.stringify(error)
  //     );

  //     res.status(StatusCodes.BAD_REQUEST);
  //     return res.json({
  //       success: false,
  //       error: errorMessage,
  //     });
  //   }
  // };

  // Get Post Feed
  // @route  GET /api/v1/post/feed
  public getPostFeed = async (
    req: IRequest,
    res: IResponse,
    next: INext
  ): Promise<any> => {
    if (req.method !== EHttpMethod.GET) {
      return next(
        new ApiError(StringValues.INVALID_REQUEST_METHOD, StatusCodes.NOT_FOUND)
      );
    }

    let findParams: Record<string, any> = {};
    let sortParams: Record<string, any> = {};

    const reqQueries: Record<string, any> = req.query;
    const page = reqQueries["page"] ? parseInt(reqQueries["page"]) : 1;
    const limit = reqQueries["limit"] ? parseInt(reqQueries["limit"]) : 10;
    const skip = page - 1 >= 0 ? (page - 1) * limit : 0;

    try {
      // if (reqQueries.minQualification) {
      //   findParams = {
      //     ...findParams,
      //     minQualification: reqQueries.minQualification,
      //   };
      // }

      // if (reqQueries.industry) {
      //   findParams = {
      //     ...findParams,
      //     industry: reqQueries.industry,
      //   };
      // }

      // if (reqQueries.category) {
      //   findParams = {
      //     ...findParams,
      //     category: reqQueries.category,
      //   };
      // }

      // if (reqQueries.district) {
      //   findParams = {
      //     ...findParams,
      //     "location.district": reqQueries.district,
      //   };
      // }

      if (reqQueries["q"]) {
        findParams = {
          ...findParams,
          title: {
            $regex: new RegExp(reqQueries["q"], "i"),
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
        } else {
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
        } else {
          sortParams = {
            ...sortParams,
            [reqQueries["desc"]]: -1,
          };
        }
      }

      // console.log("findParams:", findParams);
      // console.log("sortParams:", sortParams);

      const finalResponse = await this._postSvc.findAllExc({
        findParams: findParams,
        sortParams: sortParams,
        page: page,
        limit: limit,
        skip: skip,
        currentUser: req.currentUser,
      });

      res.status(StatusCodes.OK);
      return res.json({
        success: true,
        message: StringValues.SUCCESS,
        ...finalResponse,
      });
    } catch (error: any) {
      const errorMessage =
        error?.message || error || StringValues.SOMETHING_WENT_WRONG;

      Logger.error(
        "PostController: getJobs",
        "errorInfo:" + JSON.stringify(error)
      );

      res.status(StatusCodes.BAD_REQUEST);
      return res.json({
        success: false,
        error: errorMessage,
      });
    }
  };
}

export default PostController;
