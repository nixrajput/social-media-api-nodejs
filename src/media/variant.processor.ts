import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { VariantService } from './variant.service';

export interface VariantJob {
  key: string;
}

@Processor('media')
export class VariantProcessor extends WorkerHost {
  constructor(private readonly variants: VariantService) {
    super();
  }

  async process(job: Job<VariantJob>): Promise<void> {
    await this.variants.makeVariants(job.data.key);
  }
}
