import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { createApp } from '../src/bootstrap';
import { registerAndLogin } from './helpers/auth';

describe('close-friends lists', () => {
  let app: NestFastifyApplication;
  beforeAll(async () => {
    app = await createApp();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });
  afterAll(async () => app.close());

  it('creates a list, adds a member, and lists it', async () => {
    const owner = await registerAndLogin(app);
    const friend = await registerAndLogin(app);
    const friendView = await app.inject({
      method: 'GET',
      url: `/api/v1/users/${friend.username}`,
      headers: { authorization: `Bearer ${owner.access}` },
    });
    const friendId = friendView.json<{ user: { id: string } }>().user.id;

    const create = await app.inject({
      method: 'POST',
      url: '/api/v1/lists',
      headers: { authorization: `Bearer ${owner.access}` },
      payload: { name: 'Inner circle' },
    });
    expect(create.statusCode).toBe(201);
    const listId = create.json<{ id: string }>().id;

    const add = await app.inject({
      method: 'PUT',
      url: `/api/v1/lists/${listId}/members/${friendId}`,
      headers: { authorization: `Bearer ${owner.access}` },
    });
    expect(add.statusCode).toBe(204);

    const list = await app.inject({
      method: 'GET',
      url: '/api/v1/lists',
      headers: { authorization: `Bearer ${owner.access}` },
    });
    const items = list.json<{ items: { id: string; memberCount: number }[] }>().items;
    expect(items.find((l) => l.id === listId)?.memberCount).toBe(1);
  });
});
