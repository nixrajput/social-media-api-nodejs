/**
 * Define Profile Service Class
 */

import type {
  IRecruiterProfile,
  IRecruiterProfileModel,
} from "../interfaces/entities/recruiterProfile";
import Logger from "../logger";
import RecruiterProfile from "../models/RecruiterProfile";

class ProfileService {
  // Create Recruiter Profile Service
  public createRecruiterExc = async (
    _profile: IRecruiterProfile
  ): Promise<IRecruiterProfileModel> => {
    try {
      const recruiterProfile = await RecruiterProfile.create(_profile);

      return Promise.resolve(recruiterProfile);
    } catch (error) {
      Logger.error(
        "ProfileService: createRecruiterExc",
        "errorInfo:" + JSON.stringify(error)
      );
      return Promise.reject(error);
    }
  };
}

export default ProfileService;
