# Deploy

Single VPS, Docker Compose, Caddy for TLS.

## One-time VPS setup

1. Provision Ubuntu 24.04 VPS (Hetzner CX22 class). Install Docker + compose plugin.
2. `mkdir -p /opt/social-api && cd /opt/social-api`
3. Copy `compose.prod.yaml` and `deploy/Caddyfile` to the VPS.
4. Create `/opt/social-api/.env.production`:
   - `NODE_ENV=production`, `PORT=4000`
   - `DATABASE_URL=postgres://app:<strong-pass>@postgres:5432/social`
   - `POSTGRES_USER=app`, `POSTGRES_PASSWORD=<strong-pass>`, `POSTGRES_DB=social`
   - `REDIS_URL=redis://redis:6379`
   - `API_DOMAIN=<your api domain>`
   - `JWT_ACCESS_SECRET=<32+ random chars>` (added in plan 1B)
   - `CORS_ORIGINS=` (server-to-app only; no browser origins yet)
5. Point the domain's A record at the VPS; Caddy provisions TLS automatically.

## Repo secrets (GitHub -> Settings -> Secrets)

`DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY` (private key for a deploy-only user).

## Deploying

Run the `Deploy` workflow (workflow_dispatch). It builds and pushes
`ghcr.io/nixrajput/social-media-api:latest`, then pulls + restarts on the VPS.
Migrations: `docker compose -f compose.prod.yaml exec api npx drizzle-kit migrate`.

## Backups

Nightly `pg_dump` piped to an age-encrypted file, uploaded to R2 (cron on VPS):
`pg_dump | age -r <recipient> | rclone rcat r2:backups/social/$(date +%F).sql.age`

## Note

The production Docker image build is unverified locally (no Docker on the dev
machine at authoring time). The `Deploy` workflow builds it in CI on GitHub's
runners; verify the first deploy run before trusting the image.
