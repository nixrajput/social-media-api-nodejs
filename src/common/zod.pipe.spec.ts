import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { ApiException } from './exception.filter';
import { ZodValidationPipe } from './zod.pipe';

const schema = z.object({ email: z.string().min(3), age: z.coerce.number().int() });

describe('ZodValidationPipe', () => {
  const pipe = new ZodValidationPipe(schema);

  it('returns the parsed (coerced) value on success', () => {
    expect(pipe.transform({ email: 'a@b.c', age: '30' })).toEqual({ email: 'a@b.c', age: 30 });
  });

  it('throws ApiException VALIDATION 400 naming the bad field', () => {
    try {
      pipe.transform({ age: 'x' });
      expect.unreachable('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiException);
      const e = err as ApiException;
      expect(e.code).toBe('VALIDATION');
      expect(e.getStatus()).toBe(400);
      expect(e.message).toContain('email');
    }
  });
});
