import type UserService from "../../services/user";
import type { IRequest, IResponse, INext } from "../../interfaces/core/express";
declare class LoginController {
    readonly userSvc: UserService;
    private readonly _userSvc;
    constructor(userSvc: UserService);
    sendLoginOtp: (req: IRequest, res: IResponse, next: INext) => Promise<any>;
    login: (req: IRequest, res: IResponse, next: INext) => Promise<any>;
}
export default LoginController;
