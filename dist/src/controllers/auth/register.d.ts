import type ProfileService from "../../services/profile";
import type { IRequest, IResponse, INext } from "../../interfaces/core/express";
import type UserService from "../../services/user";
declare class RegisterController {
    readonly userSvc: UserService;
    readonly profileSvc: ProfileService;
    private readonly _userSvc;
    private readonly _profileSvc;
    constructor(userSvc: UserService, profileSvc: ProfileService);
    sendRegisterOtp: (req: IRequest, res: IResponse, next: INext) => Promise<any>;
    register: (req: IRequest, res: IResponse, next: INext) => Promise<any>;
}
export default RegisterController;
