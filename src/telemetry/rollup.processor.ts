import { Processor, WorkerHost } from '@nestjs/bullmq';
import { RollupService } from './rollup.service';

@Processor('telemetry')
export class RollupProcessor extends WorkerHost {
  constructor(private readonly rollup: RollupService) {
    super();
  }

  async process(): Promise<void> {
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    await this.rollup.rollupDay(yesterday);
  }
}
