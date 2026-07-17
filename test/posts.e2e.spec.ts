import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { createApp } from '../src/bootstrap';
import { registerAndLogin } from './helpers/auth';

describe('posts', () => {
  let app: NestFastifyApplication;
  beforeAll(async () => {
    app = await createApp();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });
  afterAll(async () => app.close());

  async function readyUpload(access: string): Promise<string> {
    const create = await app.inject({
      method: 'POST',
      url: '/api/v1/media/uploads',
      headers: { authorization: `Bearer ${access}` },
      payload: { kind: 'post-image', contentLength: 2048, sha256: 'abc' },
    });
    const id = create.json().uploadId as string;
    await app.inject({
      method: 'POST',
      url: `/api/v1/media/uploads/${id}/complete`,
      headers: { authorization: `Bearer ${access}` },
    });
    return id;
  }

  async function createPost(
    access: string,
    body: Record<string, unknown>,
  ): Promise<{ statusCode: number; json: () => any }> {
    const uploadId = await readyUpload(access);
    return app.inject({
      method: 'POST',
      url: '/api/v1/posts',
      headers: { authorization: `Bearer ${access}` },
      payload: {
        audience: 'public',
        media: [{ uploadId, type: 'image', width: 100, height: 100 }],
        ...body,
      },
    });
  }

  const get = (access: string, id: string) =>
    app.inject({
      method: 'GET',
      url: `/api/v1/posts/${id}`,
      headers: { authorization: `Bearer ${access}` },
    });

  it('creates a public post with a media url', async () => {
    const author = await registerAndLogin(app);
    const res = await createPost(author.access, { caption: 'hello' });
    expect(res.statusCode).toBe(201);
    const post = res.json().post ?? res.json();
    expect(post.media[0].url).toContain('http');
    expect(post.audience).toBe('public');
  });

  it('followers-only post is hidden from a stranger, shown to a follower', async () => {
    const author = await registerAndLogin(app);
    const follower = await registerAndLogin(app);
    const created = await createPost(author.access, { audience: 'followers' });
    const postId = (created.json().post ?? created.json()).id as string;

    expect((await get(follower.access, postId)).statusCode).toBe(404);
    await app.inject({
      method: 'POST',
      url: `/api/v1/users/${author.userId}/follow`,
      headers: { authorization: `Bearer ${follower.access}` },
    });
    expect((await get(follower.access, postId)).statusCode).toBe(200);
  });

  it('list post is visible only to a list member', async () => {
    const author = await registerAndLogin(app);
    const member = await registerAndLogin(app);
    const stranger = await registerAndLogin(app);
    const listRes = await app.inject({
      method: 'POST',
      url: '/api/v1/lists',
      headers: { authorization: `Bearer ${author.access}` },
      payload: { name: 'close' },
    });
    const listId = listRes.json().id as string;
    await app.inject({
      method: 'PUT',
      url: `/api/v1/lists/${listId}/members/${member.userId}`,
      headers: { authorization: `Bearer ${author.access}` },
    });
    const created = await createPost(author.access, { audience: 'list', listId });
    const postId = (created.json().post ?? created.json()).id as string;

    expect((await get(member.access, postId)).statusCode).toBe(200);
    expect((await get(stranger.access, postId)).statusCode).toBe(404);
  });

  it('edit within the window sets editedAt; delete then 404', async () => {
    const author = await registerAndLogin(app);
    const created = await createPost(author.access, { caption: 'v1' });
    const postId = (created.json().post ?? created.json()).id as string;

    const edited = await app.inject({
      method: 'PATCH',
      url: `/api/v1/posts/${postId}`,
      headers: { authorization: `Bearer ${author.access}` },
      payload: { caption: 'v2' },
    });
    expect(edited.statusCode).toBe(200);
    expect((edited.json().post ?? edited.json()).editedAt).toBeTruthy();

    const del = await app.inject({
      method: 'DELETE',
      url: `/api/v1/posts/${postId}`,
      headers: { authorization: `Bearer ${author.access}` },
    });
    expect(del.statusCode).toBe(204);
    expect((await get(author.access, postId)).statusCode).toBe(404);
  });
});
