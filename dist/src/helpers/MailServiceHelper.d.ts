export interface MailTo {
    name: string;
    email: string;
}
export interface MailContent {
    type: string;
    value: string;
}
export interface MailOptions {
    to: string | string[] | MailTo[] | (string | MailTo)[];
    subject: string;
    cc?: string | string[] | MailTo[] | (string | MailTo)[];
    bcc?: string | string[] | MailTo[] | (string | MailTo)[];
    textContent?: string;
    htmlContent?: string;
    category?: string;
    content?: MailContent[] & {
        0: MailContent;
    };
}
declare class MailServiceHelper {
    static sendEmail({ to, cc, bcc, subject, textContent, htmlContent, category, content, }: MailOptions): Promise<void>;
}
export default MailServiceHelper;
