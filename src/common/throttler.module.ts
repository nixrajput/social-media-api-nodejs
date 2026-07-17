import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { loadEnv } from '../config/env';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: () => {
        const env = loadEnv();
        return {
          throttlers: [{ ttl: 60_000, limit: env.RATE_LIMIT_MAX }],
          storage:
            env.NODE_ENV === 'production'
              ? new ThrottlerStorageRedisService(env.REDIS_URL)
              : undefined,
        };
      },
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppThrottlerModule {}
