import type { ObjectId } from "mongoose";
import type { IUser, IUserModel } from "../interfaces/entities/user";
declare class UserService {
    createUserExc: (_user: IUser) => Promise<IUserModel>;
    findUserByIdExc: (_userId: string | ObjectId) => Promise<IUserModel>;
    findUserByEmailExc: (_email: string) => Promise<IUserModel>;
    checkIsEmailExistsExc: (_email: string) => Promise<boolean>;
    checkIsUsernameExistsExc: (_username: string) => Promise<boolean>;
    checkIsPhoneExistsExc: (_phone: string) => Promise<boolean>;
}
export default UserService;
