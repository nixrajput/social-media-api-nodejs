import { randomBytes } from 'node:crypto';
import { afterAll, describe, expect, it } from 'vitest';
import { telemetryEvents } from '../db/schema';
import { testDb } from '../../test/helpers/db';
import { RollupService } from './rollup.service';

const hasDb = Boolean(process.env.DATABASE_URL);
const { db, close } = testDb();
const svc = new RollupService(db);

describe.runIf(hasDb)('RollupService', () => {
  afterAll(async () => close());

  it('counts events by name for a given UTC day', async () => {
    const name = `evt_${randomBytes(4).toString('hex')}`;
    const day = '2026-02-02';
    await db.insert(telemetryEvents).values([
      { name, ts: new Date(`${day}T01:00:00Z`) },
      { name, ts: new Date(`${day}T05:00:00Z`) },
    ]);
    const written = await svc.rollupDay(day);
    expect(written).toBeGreaterThanOrEqual(1);
  });
});
