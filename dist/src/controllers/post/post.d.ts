import type { IRequest, IResponse, INext } from "../../interfaces/core/express";
import PostService from "../../services/post";
declare class PostController {
    readonly postSvc: PostService;
    private readonly _postSvc;
    constructor(postSvc: PostService);
    getPostFeed: (req: IRequest, res: IResponse, next: INext) => Promise<any>;
}
export default PostController;
