import { loadEnv } from './config/env';
import { createApp } from './bootstrap';

async function main(): Promise<void> {
  const env = loadEnv();
  const app = await createApp();
  await app.listen({ port: env.PORT, host: '0.0.0.0' });
}

void main();
