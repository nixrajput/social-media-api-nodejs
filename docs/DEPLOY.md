# Deploy

Host-agnostic, source-based, no Docker. Runs on any always-on host (VPS, AWS
Lightsail, Azure VM, Fly, Railway, Render, ...). The only hard requirements:

- Node.js 22+ and pnpm
- A reachable PostgreSQL 16 and Redis 7 (local on the box, or managed - only the
  connection URLs change)
- A process manager to keep it running (systemd or pm2)
- A TLS-terminating reverse proxy in front (Caddy/nginx/Cloudflare) - the app
  itself serves plain HTTP on `PORT`

Media stays on Cloudflare R2 (S3-compatible, zero egress); configured in a later plan.

## First deploy

```sh
git clone <repo> && cd social-media-api
pnpm install --frozen-lockfile
pnpm build
pnpm db:migrate          # applies drizzle migrations
pnpm start               # node dist/main.js, listens on $PORT (default 4000)
```

## Environment

Set these (via the host's env config, a systemd unit `Environment=`, or an
`.env.production` you source - never commit it):

- `NODE_ENV=production`
- `PORT=4000`
- `DATABASE_URL=postgres://<user>:<pass>@<host>:5432/<db>`
- `REDIS_URL=redis://<host>:6379`
- `CORS_ORIGINS=` (comma-separated browser origins; empty denies all - fine for
  a mobile-only client)
- `JWT_ACCESS_SECRET=<32+ random chars>` (added in plan 1B)

See `.env.example` for the current full list.

## Keeping it alive (pick one)

**systemd** (`/etc/systemd/system/social-api.service`):

```ini
[Service]
WorkingDirectory=/opt/social-api
ExecStart=/usr/bin/pnpm start
EnvironmentFile=/opt/social-api/.env.production
Restart=always
User=www-data
[Install]
WantedBy=multi-user.target
```

**pm2**: `pm2 start "pnpm start" --name social-api && pm2 save`

## Updating

```sh
git pull && pnpm install --frozen-lockfile && pnpm build && pnpm db:migrate
# then: systemctl restart social-api   (or: pm2 restart social-api)
```

## Scaling later

Move Postgres/Redis to managed services (RDS/ElastiCache, Azure Flexible/Cache,
Neon/Upstash) by changing `DATABASE_URL`/`REDIS_URL` only - no code change. Split
the queue workers to their own process when throughput needs it.

## CI note

`.github/workflows/ci.yml` uses GitHub-managed Postgres/Redis service containers
for tests. Those are ephemeral CI infrastructure provided by GitHub - not a Docker
dependency you install or maintain.
