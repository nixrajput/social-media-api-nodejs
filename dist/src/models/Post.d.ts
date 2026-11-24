import { Types } from "mongoose";
import type { IPostModel } from "../interfaces/entities/post";
declare const Post: import("mongoose").Model<IPostModel, {}, {}, {}, import("mongoose").Document<unknown, {}, IPostModel, {}, import("mongoose").DefaultSchemaOptions> & IPostModel & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPostModel & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
export default Post;
