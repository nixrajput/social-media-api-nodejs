/**
 * Define Profile Service Class
 */

import type { IUserModel } from "src/interfaces/entities/user";
import Logger from "src/logger";

class ProfileService {
  // Get Recruiter Profile Service
  public getProfileExc = async (currentUser: IUserModel): Promise<any> => {
    try {
      // const profileDetails: IRecruiterProfileResponse = {
      //   userId: currentUser._id,
      //   name: currentUser.name,
      //   nameChangedAt: currentUser.nameChangedAt,
      //   email: currentUser.email,
      //   isEmailVerified: currentUser.isEmailVerified,
      //   emailChangedAt: currentUser.emailChangedAt,
      //   countryCode: currentUser.countryCode,
      //   phone: currentUser.phone,
      //   isPhoneVerified: currentUser.isPhoneVerified,
      //   phoneChangedAt: currentUser.phoneChangedAt,
      //   whatsAppNo: currentUser.whatsAppNo,
      //   userType: currentUser.userType,
      //   accountStatus: currentUser.accountStatus,
      //   profileId: recruiterProfile._id,
      //   jobPostsCount: recruiterProfile.jobPostsCount,
      //   companyName: recruiterProfile.companyName,
      //   designation: recruiterProfile.designation,
      //   linkedInUrl: recruiterProfile.linkedInUrl,
      //   website: recruiterProfile.website,
      //   totalEmployees: recruiterProfile.totalEmployees,
      //   address: recruiterProfile.address,
      //   industryType: recruiterProfile.industryType,
      //   companyType: recruiterProfile.companyType,
      //   about: recruiterProfile.about,
      //   logoUrl: recruiterProfile.logoUrl,
      //   tagline: recruiterProfile.tagline,
      //   xUrl: recruiterProfile.xUrl,
      //   instagramUrl: recruiterProfile.instagramUrl,
      //   facebookUrl: recruiterProfile.facebookUrl,
      //   createdAt: currentUser.createdAt,
      //   updatedAt: currentUser.updatedAt,
      // };
      return Promise.resolve(currentUser);
    } catch (error) {
      Logger.getInstance().error(
        "ProfileService: getProfileExc",
        "errorInfo:" + JSON.stringify(error)
      );
      return Promise.reject(error);
    }
  };

  // Create Recruiter Profile Service
  // public createRecruiterExc = async (
  //   _profile: IRecruiterProfile
  // ): Promise<IRecruiterProfileModel> => {
  //   try {
  //     const recruiterProfile = await RecruiterProfile.create(_profile);
  //     return Promise.resolve(recruiterProfile);
  //   } catch (error) {
  //     Logger.getInstance().error(
  //       "ProfileService: createRecruiterExc",
  //       "errorInfo:" + JSON.stringify(error)
  //     );
  //     return Promise.reject(error);
  //   }
  // };
}

export default ProfileService;
