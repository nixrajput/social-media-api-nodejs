import { Controller, Get, Inject } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DB, type Db } from '../db/db.module';

@Controller('health')
export class HealthController {
  constructor(@Inject(DB) private readonly db: Db) {}

  @Get()
  async health(): Promise<{ status: string; db?: string }> {
    try {
      await this.db.execute(sql`SELECT 1`);
      return { status: 'ok', db: 'up' };
    } catch {
      return { status: 'ok' };
    }
  }
}
