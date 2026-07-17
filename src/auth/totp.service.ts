import { createHash, randomBytes } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { Secret, TOTP } from 'otpauth';

@Injectable()
export class TotpService {
  generateSecret(): string {
    return new Secret({ size: 20 }).base32;
  }

  otpauthUrl(secret: string, email: string): string {
    return new TOTP({ issuer: 'SocialApp', label: email, secret }).toString();
  }

  verify(secret: string, token: string): boolean {
    return new TOTP({ secret }).validate({ token, window: 1 }) !== null;
  }

  makeRecoveryCodes(): { plain: string[]; hashes: string[] } {
    const plain = Array.from({ length: 10 }, () => randomBytes(5).toString('hex'));
    const hashes = plain.map((c) => createHash('sha256').update(c).digest('hex'));
    return { plain, hashes };
  }
}
