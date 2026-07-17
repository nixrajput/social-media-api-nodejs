import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

export interface OtpJob {
  to: string;
  code: string;
  purpose: 'register' | 'reset_password';
}

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail') private readonly queue: Queue) {}

  async enqueueOtp(to: string, code: string, purpose: OtpJob['purpose']): Promise<void> {
    await this.queue.add('otp', { to, code, purpose } satisfies OtpJob, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
    });
  }
}
