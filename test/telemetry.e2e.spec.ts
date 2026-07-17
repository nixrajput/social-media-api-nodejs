import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { eq } from 'drizzle-orm';
import { createApp } from '../src/bootstrap';
import { telemetryEvents } from '../src/db/schema';
import { testDb } from './helpers/db';

describe('telemetry', () => {
  let app: NestFastifyApplication;
  const { db, close } = testDb();
  beforeAll(async () => {
    app = await createApp();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });
  afterAll(async () => {
    await app.close();
    await close();
  });

  it('accepts a batch of events (202) and stores them', async () => {
    const sessionId = `s${Date.now()}`;
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/telemetry/events',
      payload: {
        events: [
          { name: 'app_open', ts: new Date().toISOString(), sessionId },
          { name: 'feed_view', props: { tab: 'home' }, ts: new Date().toISOString(), sessionId },
        ],
      },
    });
    expect(res.statusCode).toBe(202);
    const rows = await db
      .select()
      .from(telemetryEvents)
      .where(eq(telemetryEvents.sessionId, sessionId));
    expect(rows.length).toBe(2);
  });

  it('rejects a batch over 100 events with 400', async () => {
    const events = Array.from({ length: 101 }, () => ({ name: 'x', ts: new Date().toISOString() }));
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/telemetry/events',
      payload: { events },
    });
    expect(res.statusCode).toBe(400);
  });

  it('accepts a crash report', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/telemetry/crashes',
      payload: {
        platform: 'android',
        appVersion: '2.0.0',
        error: 'RangeError',
        stackTrace: 'at x (y.dart:1)',
        deviceModel: 'Pixel 8',
        osVersion: '15',
        ts: new Date().toISOString(),
      },
    });
    expect(res.statusCode).toBe(202);
  });
});
