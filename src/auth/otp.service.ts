import { createHash, randomInt } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq, gt, isNull } from 'drizzle-orm';
import { ApiException } from '../common/exception.filter';
import { DB, type Db } from '../db/db.module';
import { otps } from '../db/schema';

const EXPIRY_MS = 15 * 60_000;
const RESEND_COOLDOWN_MS = 60_000;
const MAX_ATTEMPTS = 5;
type Purpose = 'register' | 'reset_password';

@Injectable()
export class OtpService {
  constructor(@Inject(DB) private readonly db: Db) {}

  private hash(code: string): string {
    return createHash('sha256').update(code).digest('hex');
  }

  async issue(email: string, purpose: Purpose): Promise<string> {
    const [recent] = await this.db
      .select()
      .from(otps)
      .where(and(eq(otps.email, email), eq(otps.purpose, purpose)))
      .orderBy(desc(otps.createdAt))
      .limit(1);
    if (recent && Date.now() - recent.createdAt.getTime() < RESEND_COOLDOWN_MS) {
      throw new ApiException('RATE_LIMITED', 'Please wait before requesting another code', 429);
    }
    const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
    await this.db.insert(otps).values({
      email,
      codeHash: this.hash(code),
      purpose,
      expiresAt: new Date(Date.now() + EXPIRY_MS),
    });
    return code;
  }

  async consume(email: string, code: string, purpose: Purpose): Promise<boolean> {
    const [row] = await this.db
      .select()
      .from(otps)
      .where(
        and(
          eq(otps.email, email),
          eq(otps.purpose, purpose),
          isNull(otps.consumedAt),
          gt(otps.expiresAt, new Date()),
        ),
      )
      .orderBy(desc(otps.createdAt))
      .limit(1);
    if (!row) return false;
    if (row.attempts >= MAX_ATTEMPTS) return false;
    if (row.codeHash !== this.hash(code)) {
      await this.db
        .update(otps)
        .set({ attempts: row.attempts + 1 })
        .where(eq(otps.id, row.id));
      return false;
    }
    await this.db.update(otps).set({ consumedAt: new Date() }).where(eq(otps.id, row.id));
    return true;
  }
}
