import { config } from 'dotenv';

// Load .env.test for the test run if present. Missing file is a no-op, so CI
// (which sets env directly) and inline `DATABASE_URL=... pnpm test` still work.
config({ path: '.env.test' });
