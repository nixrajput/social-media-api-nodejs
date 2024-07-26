declare class EmailTemplateHelper {
    static getOtpEmail(otp: string, name?: string): Promise<string>;
}
export default EmailTemplateHelper;
