import type { IOtpModel } from "../interfaces/entities/otp";
export interface IOtpOptions {
    size?: number;
    expireIn?: number;
    useLowerCaseAlphabets?: boolean;
    useUpperCaseAlphabets?: boolean;
    useSpecialChars?: boolean;
}
declare class OtpServiceHelper {
    static generateOtpFromEmail(email: string, options?: IOtpOptions): Promise<IOtpModel>;
}
export default OtpServiceHelper;
