import type { IUserModel } from "src/interfaces/entities/user";
declare class ProfileService {
    getProfileExc: (currentUser: IUserModel) => Promise<any>;
}
export default ProfileService;
