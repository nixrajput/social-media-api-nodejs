import type { IUserModel } from "../interfaces/entities/user";
declare const User: import("mongoose").Model<IUserModel, {}, {}, {}, import("mongoose").Document<unknown, {}, IUserModel, {}, import("mongoose").DefaultSchemaOptions> & IUserModel & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUserModel & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
export default User;
