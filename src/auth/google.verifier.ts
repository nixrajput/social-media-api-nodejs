import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ApiException } from '../common/exception.filter';
import { loadEnv } from '../config/env';

export interface GoogleIdentity {
  providerAccountId: string;
  email: string;
  emailVerified: boolean;
  displayName: string | null;
  avatarUrl: string | null;
}

@Injectable()
export class GoogleVerifier {
  private readonly env = loadEnv();
  private readonly client = new OAuth2Client();

  async verify(idToken: string): Promise<GoogleIdentity> {
    // ponytail: test hook - the e2e app is the real NestFactory build with no
    // provider overrides, so tests pass a base64url(JSON) token we decode here
    // instead of reaching Google. Never active outside NODE_ENV=test.
    if (this.env.NODE_ENV === 'test') return this.decodeFake(idToken);

    const audience = this.env.GOOGLE_OAUTH_CLIENT_IDS.split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    let payload;
    try {
      const ticket = await this.client.verifyIdToken({ idToken, audience });
      payload = ticket.getPayload();
    } catch {
      throw new ApiException('UNAUTHORIZED', 'Invalid Google token', 401);
    }
    if (!payload?.sub || !payload.email) {
      throw new ApiException('UNAUTHORIZED', 'Invalid Google token', 401);
    }
    return {
      providerAccountId: payload.sub,
      email: payload.email,
      emailVerified: payload.email_verified ?? false,
      displayName: payload.name ?? null,
      avatarUrl: payload.picture ?? null,
    };
  }

  private decodeFake(idToken: string): GoogleIdentity {
    try {
      const p = JSON.parse(Buffer.from(idToken, 'base64url').toString()) as GoogleIdentity;
      if (!p.email || !p.providerAccountId) throw new Error('missing fields');
      return {
        providerAccountId: p.providerAccountId,
        email: p.email,
        emailVerified: p.emailVerified ?? true,
        displayName: p.displayName ?? null,
        avatarUrl: p.avatarUrl ?? null,
      };
    } catch {
      throw new ApiException('UNAUTHORIZED', 'Invalid Google token', 401);
    }
  }
}
