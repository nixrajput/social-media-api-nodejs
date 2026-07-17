import type { Queue } from 'bullmq';
import { describe, expect, it, vi } from 'vitest';
import { MailService } from './mail.service';

describe('MailService', () => {
  it('enqueues an otp job with the code and purpose', async () => {
    const add = vi.fn().mockResolvedValue(undefined);
    const svc = new MailService({ add } as unknown as Queue);
    await svc.enqueueOtp('a@b.c', '123456', 'register');
    expect(add).toHaveBeenCalledWith(
      'otp',
      { to: 'a@b.c', code: '123456', purpose: 'register' },
      expect.objectContaining({ attempts: expect.any(Number) }),
    );
  });
});
