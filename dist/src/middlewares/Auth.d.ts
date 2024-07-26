import type { INext, IRequest, IResponse } from "../interfaces/core/express";
declare class AuthMiddleware {
    static isAuthenticatedUser(req: IRequest, res: IResponse, next: INext): Promise<any>;
}
export default AuthMiddleware;
