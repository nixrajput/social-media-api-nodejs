import { describe, expect, it } from 'vitest';
import { loadEnv } from './env';

const valid = {
  NODE_ENV: 'test',
  PORT: '4100',
  DATABASE_URL: 'postgres://app:app@localhost:5432/social_test',
  REDIS_URL: 'redis://localhost:6379',
};

describe('loadEnv', () => {
  it('parses a valid environment and coerces PORT to number', () => {
    const env = loadEnv(valid);
    expect(env.PORT).toBe(4100);
    expect(env.NODE_ENV).toBe('test');
  });

  it('throws naming the missing variable', () => {
    const { DATABASE_URL: _omitted, ...rest } = valid;
    expect(() => loadEnv(rest)).toThrow(/DATABASE_URL/);
  });

  it('defaults NODE_ENV to development and PORT to 4000', () => {
    const env = loadEnv({
      DATABASE_URL: valid.DATABASE_URL,
      REDIS_URL: valid.REDIS_URL,
    });
    expect(env.NODE_ENV).toBe('development');
    expect(env.PORT).toBe(4000);
  });
});
