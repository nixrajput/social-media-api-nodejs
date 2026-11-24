import { Types } from "mongoose";
import type { IAuthTokenModel } from "../interfaces/entities/authToken";
declare const AuthToken: import("mongoose").Model<IAuthTokenModel, {}, {}, {}, import("mongoose").Document<unknown, {}, IAuthTokenModel, {}, import("mongoose").DefaultSchemaOptions> & IAuthTokenModel & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAuthTokenModel & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
export default AuthToken;
