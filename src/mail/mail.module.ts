import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { loadEnv } from '../config/env';
import { MailProcessor } from './mail.processor';
import { MAIL_PROVIDER } from './mail.provider';
import { MailService } from './mail.service';
import { SmtpProvider } from './smtp.provider';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: () => ({ connection: { url: loadEnv().REDIS_URL } }),
    }),
    BullModule.registerQueue({ name: 'mail' }),
  ],
  providers: [
    MailService,
    { provide: MAIL_PROVIDER, useClass: SmtpProvider },
    // The worker holds a blocking Redis connection; skip it under tests so
    // vitest tears down cleanly. It runs in dev and production.
    ...(process.env.NODE_ENV === 'test' ? [] : [MailProcessor]),
  ],
  exports: [MailService, BullModule],
})
export class MailModule {}
