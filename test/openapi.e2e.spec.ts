import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { createApp } from '../src/bootstrap';

describe('openapi', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    app = await createApp();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('serves the openapi json with the health path', async () => {
    const res = await app.inject({ method: 'GET', url: '/docs-json' });
    expect(res.statusCode).toBe(200);
    const doc = res.json<{ paths: Record<string, unknown> }>();
    expect(Object.keys(doc.paths)).toContain('/api/v1/health');
  });
});
