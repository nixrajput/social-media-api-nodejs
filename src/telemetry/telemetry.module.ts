import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { Module, OnModuleInit } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Queue } from 'bullmq';
import { OptionalAuthGuard } from './optional-auth.guard';
import { RollupProcessor } from './rollup.processor';
import { RollupService } from './rollup.service';
import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './telemetry.service';

const isTest = process.env.NODE_ENV === 'test';

@Module({
  imports: [JwtModule.register({}), BullModule.registerQueue({ name: 'telemetry' })],
  controllers: [TelemetryController],
  providers: [
    TelemetryService,
    OptionalAuthGuard,
    RollupService,
    // Worker holds a blocking Redis connection; skip under tests (runs elsewhere).
    ...(isTest ? [] : [RollupProcessor]),
  ],
})
export class TelemetryModule implements OnModuleInit {
  constructor(@InjectQueue('telemetry') private readonly queue: Queue) {}

  async onModuleInit(): Promise<void> {
    if (isTest) return;
    await this.queue.add(
      'rollup',
      {},
      { repeat: { pattern: '0 3 * * *' }, jobId: 'nightly-rollup', removeOnComplete: true },
    );
  }
}
