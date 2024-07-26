import type { IRequest, IResponse, INext } from "../../interfaces/core/express";
declare class ProfileController {
    getProfileDetails: (req: IRequest, res: IResponse, next: INext) => Promise<any>;
}
export default ProfileController;
