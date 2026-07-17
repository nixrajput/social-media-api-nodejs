export const MAIL_PROVIDER = Symbol('MAIL_PROVIDER');

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
}

export interface MailProvider {
  send(msg: MailMessage): Promise<void>;
}
