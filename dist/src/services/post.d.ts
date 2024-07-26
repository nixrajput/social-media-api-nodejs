import type { IUserModel } from "../interfaces/entities/user";
import type { IListResponse } from "../interfaces/responses/listResponse";
import type { IPost, IPostModel } from "../interfaces/entities/post";
declare class PostService {
    findAllExc: ({ findParams, sortParams, page, limit, skip, currentUser, }: {
        findParams?: Record<string, any>;
        sortParams?: Record<string, any>;
        page?: number;
        limit?: number;
        skip?: number;
        currentUser?: IUserModel;
    }) => Promise<IListResponse<IPost>>;
    findByIdExc: (id: string) => Promise<IPostModel>;
}
export default PostService;
