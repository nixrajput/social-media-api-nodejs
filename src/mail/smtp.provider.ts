import { Injectable, Logger } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { loadEnv } from '../config/env';
import type { MailMessage, MailProvider } from './mail.provider';

@Injectable()
export class SmtpProvider implements MailProvider {
  private readonly logger = new Logger(SmtpProvider.name);
  private readonly from = loadEnv().MAIL_FROM;
  private readonly transport: Transporter | null;

  constructor() {
    const url = loadEnv().SMTP_URL;
    this.transport = url ? createTransport(url) : null;
  }

  async send(msg: MailMessage): Promise<void> {
    if (!this.transport) {
      // No SMTP configured (dev/test): log instead of sending.
      this.logger.warn(`[mail:dev] to=${msg.to} subject=${msg.subject} :: ${msg.text}`);
      return;
    }
    await this.transport.sendMail({ from: this.from, ...msg });
  }
}
