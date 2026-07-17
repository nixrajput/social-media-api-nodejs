import { describe, expect, it } from 'vitest';
import { TOTP } from 'otpauth';
import { TotpService } from './totp.service';

describe('TotpService', () => {
  const svc = new TotpService();

  it('verifies a token generated from the same secret', () => {
    const secret = svc.generateSecret();
    const token = new TOTP({ secret }).generate();
    expect(svc.verify(secret, token)).toBe(true);
  });

  it('rejects a bad token', () => {
    const secret = svc.generateSecret();
    expect(svc.verify(secret, '000000')).toBe(false);
  });

  it('makes 10 recovery codes with matching hashes', () => {
    const { plain, hashes } = svc.makeRecoveryCodes();
    expect(plain).toHaveLength(10);
    expect(hashes).toHaveLength(10);
  });
});
