import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { createApp } from '../src/bootstrap';

describe('error envelope', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    app = await createApp();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('unknown route returns NOT_FOUND envelope with requestId', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/definitely-missing' });
    expect(res.statusCode).toBe(404);
    const body = res.json<{ error: { code: string; message: string; requestId: string } }>();
    expect(body.error.code).toBe('NOT_FOUND');
    expect(body.error.requestId).toBeTruthy();
    expect(res.headers['x-request-id']).toBeTruthy();
  });

  it('does not leak internals in the message', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/definitely-missing' });
    const raw = res.body;
    expect(raw).not.toContain('stack');
    expect(raw).not.toContain('Error:');
  });
});
