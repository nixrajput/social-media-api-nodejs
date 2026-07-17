import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import type { Job } from 'bullmq';
import { MAIL_PROVIDER, type MailProvider } from './mail.provider';
import type { OtpJob } from './mail.service';

const SUBJECT: Record<OtpJob['purpose'], string> = {
  register: 'Your verification code',
  reset_password: 'Your password reset code',
};

@Processor('mail')
export class MailProcessor extends WorkerHost {
  constructor(@Inject(MAIL_PROVIDER) private readonly provider: MailProvider) {
    super();
  }

  async process(job: Job<OtpJob>): Promise<void> {
    const { to, code, purpose } = job.data;
    await this.provider.send({
      to,
      subject: SUBJECT[purpose],
      text: `Your code is ${code}. It expires in 15 minutes.`,
    });
  }
}
