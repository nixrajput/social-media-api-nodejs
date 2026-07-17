import { describe, expect, it } from 'vitest';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  const svc = new PasswordService();

  it('hashes to an argon2id string and verifies the original', async () => {
    const hash = await svc.hash('correct horse battery');
    expect(hash.startsWith('$argon2id$')).toBe(true);
    expect(await svc.verify(hash, 'correct horse battery')).toBe(true);
  });

  it('rejects a wrong password', async () => {
    const hash = await svc.hash('correct horse battery');
    expect(await svc.verify(hash, 'wrong')).toBe(false);
  });

  it('returns false on a malformed hash instead of throwing', async () => {
    expect(await svc.verify('not-a-hash', 'x')).toBe(false);
  });
});
