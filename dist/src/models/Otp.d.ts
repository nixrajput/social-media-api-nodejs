import { Types } from "mongoose";
import type { IOtpModel } from "../interfaces/entities/otp";
declare const Otp: import("mongoose").Model<IOtpModel, {}, {}, {}, import("mongoose").Document<unknown, {}, IOtpModel, {}, import("mongoose").DefaultSchemaOptions> & IOtpModel & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IOtpModel & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
export default Otp;
