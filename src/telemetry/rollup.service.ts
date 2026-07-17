import { Inject, Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DB, type Db } from '../db/db.module';
import { telemetryDailyRollups } from '../db/schema';

@Injectable()
export class RollupService {
  constructor(@Inject(DB) private readonly db: Db) {}

  // Aggregate one UTC day of telemetry_events into telemetry_daily_rollups.
  async rollupDay(day: string): Promise<number> {
    const result = await this.db.execute(sql`
      SELECT name, count(*)::int AS count
      FROM telemetry_events
      WHERE ts >= ${`${day}T00:00:00Z`}::timestamptz
        AND ts < (${`${day}T00:00:00Z`}::timestamptz + interval '1 day')
      GROUP BY name
    `);
    const records = result.rows as { name: string; count: number }[];
    if (records.length === 0) return 0;
    await this.db
      .insert(telemetryDailyRollups)
      .values(records.map((r) => ({ day, name: r.name, count: r.count })));
    return records.length;
  }
}
