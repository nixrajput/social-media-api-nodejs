import type { IRequest, IResponse, INext } from "../../interfaces/core/express";
import type UserService from "../../services/user";
declare class PasswordController {
    readonly userSvc: UserService;
    private readonly _userSvc;
    constructor(userSvc: UserService);
    sendResetPasswordOtp: (req: IRequest, res: IResponse, next: INext) => Promise<any>;
    resetPassword: (req: IRequest, res: IResponse, next: INext) => Promise<any>;
    changePassword: (req: IRequest, res: IResponse, next: INext) => Promise<any>;
}
export default PasswordController;
