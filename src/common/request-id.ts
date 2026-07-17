import { randomUUID } from 'node:crypto';

export function requestId(headers: Record<string, unknown>): string {
  const incoming = headers['x-request-id'];
  return typeof incoming === 'string' && incoming.length > 0 ? incoming : randomUUID();
}
