import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { createApp } from '../src/bootstrap';
import { registerAndLogin } from './helpers/auth';

describe('media uploads', () => {
  let app: NestFastifyApplication;
  beforeAll(async () => {
    app = await createApp();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });
  afterAll(async () => app.close());

  it('presigns then completes an upload', async () => {
    const { access } = await registerAndLogin(app);
    const create = await app.inject({
      method: 'POST',
      url: '/api/v1/media/uploads',
      headers: { authorization: `Bearer ${access}` },
      payload: { kind: 'post-image', contentLength: 2048, sha256: 'deadbeef' },
    });
    expect(create.statusCode).toBe(201);
    const uploadId = create.json().uploadId;
    const done = await app.inject({
      method: 'POST',
      url: `/api/v1/media/uploads/${uploadId}/complete`,
      headers: { authorization: `Bearer ${access}` },
    });
    expect(done.statusCode).toBe(200);
    expect(done.json().status).toBe('ready');
  });
});
