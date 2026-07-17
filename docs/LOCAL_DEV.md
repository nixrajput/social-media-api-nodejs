# Local development setup

No Docker. Uses local Homebrew Postgres + Redis. macOS instructions; adapt for Linux.

## PostgreSQL

Homebrew PostgreSQL 16. Two databases owned by role `app`:

| Database      | Purpose                     |
| ------------- | --------------------------- |
| `social_dev`  | development                 |
| `social_test` | e2e test runs (`pnpm test`) |

One-time setup:

```sh
brew install postgresql@16
brew services start postgresql@16
psql -d postgres -c "CREATE ROLE app LOGIN PASSWORD 'app';"
psql -d postgres -c "CREATE DATABASE social_dev  OWNER app;"
psql -d postgres -c "CREATE DATABASE social_test OWNER app;"
```

Apply migrations to both:

```sh
DATABASE_URL=postgres://app:app@localhost:5432/social_dev  pnpm db:migrate
DATABASE_URL=postgres://app:app@localhost:5432/social_test pnpm db:migrate
```

**DBeaver:** New Connection -> PostgreSQL -> Host `localhost`, Port `5432`,
Database `social_dev`, User `app`, Password `app`. Add a second connection for
`social_test`.

Connection URL: `postgres://app:app@localhost:5432/social_dev`

### Changing the user / password / database names

Pick new values and apply them. To rename in place (keeps data + migration
history, so no re-migrate needed):

```sh
# close DBeaver / stop the API first (no active connections to the db you rename)
psql -d postgres -c "ALTER ROLE app RENAME TO <user>;"
psql -d postgres -c "ALTER ROLE <user> PASSWORD '<pass>';"
psql -d postgres -c "ALTER DATABASE social_dev  RENAME TO <db>;"
psql -d postgres -c "ALTER DATABASE social_test RENAME TO <testdb>;"
```

Or create fresh ones (then re-run migrations, below):

```sh
psql -d postgres -c "CREATE ROLE <user> LOGIN PASSWORD '<pass>';"
psql -d postgres -c "CREATE DATABASE <db>     OWNER <user>;"
psql -d postgres -c "CREATE DATABASE <testdb> OWNER <user>;"
```

Then update the connection strings in **three** places:

- `.env` -> `DATABASE_URL` (development)
- `.env.test` -> `DATABASE_URL` (tests; see Environment below)
- `.github/workflows/ci.yml` -> `POSTGRES_USER` / `POSTGRES_PASSWORD` /
  `POSTGRES_DB` and the `DATABASE_URL` env (CI's ephemeral database)

Re-run migrations on any **freshly created** database (renamed ones already
carry their migration history):

```sh
DATABASE_URL=postgres://<user>:<pass>@localhost:5432/<db>     pnpm db:migrate
DATABASE_URL=postgres://<user>:<pass>@localhost:5432/<testdb> pnpm db:migrate
```

## Redis

Homebrew Redis (7 or 8 both fine):

```sh
brew install redis
brew services start redis
redis-cli ping   # -> PONG
```

`REDIS_URL=redis://localhost:6379`

## Environment (.env)

Copy `.env.example` to `.env` and fill in:

```sh
cp .env.example .env
```

- `DATABASE_URL=postgres://app:app@localhost:5432/social_dev`
- `REDIS_URL=redis://localhost:6379`
- `JWT_ACCESS_SECRET` - generate a strong value (>= 16 chars):
  ```sh
  openssl rand -base64 48
  ```
- `CORS_ORIGINS` - comma-separated browser origins. Leave EMPTY for the native
  mobile client (denies all browser origins; Swagger UI is same-origin). Never
  use `*` with credentials.

### Test environment (`.env.test`)

Tests load `.env.test` automatically (via `test/setup.ts`), so `pnpm test` needs
no exported vars. Create it once (gitignored):

```
NODE_ENV=test
DATABASE_URL=postgres://app:app@localhost:5432/social_test
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=test-secret-least-16-chars
```

To point tests at a different test database, edit `DATABASE_URL` here - that's
the single local source of truth. (CI uses its own values in `ci.yml`.)

## Local email (letter_opener equivalent)

Two options:

1. **Console (default, zero setup):** with `SMTP_URL` empty, the mail provider
   logs OTP codes to the API console instead of sending. Read codes from logs.

2. **Mailpit (web inbox, recommended):** a local SMTP catcher with a browser UI.

   ```sh
   brew install mailpit
   mailpit            # SMTP on :1025, web UI at http://localhost:8025
   ```

   Then set `SMTP_URL=smtp://localhost:1025`. All outgoing mail (OTP, reset)
   appears at http://localhost:8025 - nothing leaves your machine.

## Run

```sh
pnpm install
pnpm dev                    # watch mode on PORT (default 4000)
curl localhost:4000/api/v1/health   # {"status":"ok","db":"up"}
```

OpenAPI docs (non-production): http://localhost:4000/docs
