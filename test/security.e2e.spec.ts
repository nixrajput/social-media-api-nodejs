import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { createApp } from '../src/bootstrap';

describe('security middleware', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    process.env.RATE_LIMIT_MAX = '5';
    app = await createApp();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
    delete process.env.RATE_LIMIT_MAX;
  });

  it('sets helmet headers', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/health' });
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('rate limits BEFORE the handler and uses the envelope', async () => {
    let limited = false;
    for (let i = 0; i < 10; i += 1) {
      const res = await app.inject({ method: 'GET', url: '/api/v1/health' });
      if (res.statusCode === 429) {
        limited = true;
        const body = res.json<{ error: { code: string } }>();
        expect(body.error.code).toBe('RATE_LIMITED');
        break;
      }
    }
    expect(limited).toBe(true);
  });
});
