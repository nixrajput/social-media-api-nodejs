import { randomBytes } from 'node:crypto';
import { afterAll, describe, expect, it } from 'vitest';
import { testDb } from '../../test/helpers/db';
import { OtpService } from './otp.service';

const hasDb = Boolean(process.env.DATABASE_URL);
const { db, close } = testDb();
const svc = new OtpService(db);
const email = () => `u${randomBytes(6).toString('hex')}@example.com`;

describe.runIf(hasDb)('OtpService', () => {
  afterAll(async () => close());

  it('issues a 6-digit code and consumes it once', async () => {
    const e = email();
    const code = await svc.issue(e, 'register');
    expect(code).toMatch(/^\d{6}$/);
    expect(await svc.consume(e, code, 'register')).toBe(true);
    // second consume fails (already consumed)
    expect(await svc.consume(e, code, 'register')).toBe(false);
  });

  it('rejects a wrong code', async () => {
    const e = email();
    await svc.issue(e, 'register');
    expect(await svc.consume(e, '000000', 'register')).toBe(false);
  });

  it('throttles resend within the cooldown', async () => {
    const e = email();
    await svc.issue(e, 'register');
    await expect(svc.issue(e, 'register')).rejects.toThrow(/wait/i);
  });
});
