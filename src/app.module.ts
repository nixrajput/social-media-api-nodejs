import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppThrottlerModule } from './common/throttler.module';
import { DbModule } from './db/db.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV === 'development'
            ? { target: 'pino-pretty', options: { singleLine: true } }
            : undefined,
        redact: ['req.headers.authorization', 'req.headers.cookie'],
      },
    }),
    AppThrottlerModule,
    DbModule,
    HealthModule,
  ],
})
export class AppModule {}
