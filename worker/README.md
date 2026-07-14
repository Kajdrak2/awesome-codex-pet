# awesome-codex-pet-stats Worker

Cloudflare Worker that powers privacy-conscious view, install, like, and seven-day trend statistics for the Awesome Codex Pet gallery.

- **Production URL**: `https://awesome-codex-pet-stats.legeling.workers.dev`
- **Storage**: Cloudflare D1 (`DB` binding)
- **Caching**: Cloudflare Workers Cache API, five-minute edge TTL
- **Cleanup**: daily Cron Trigger removes expired event receipts and rate-limit buckets

## Endpoints

| Method | Path                           | Purpose                                                                 |
| ------ | ------------------------------ | ----------------------------------------------------------------------- |
| `POST` | `/track/view?slug=<pet-id>`    | Count one browser view per pet and UTC day                              |
| `POST` | `/track/install?slug=<pet-id>` | Count a completed install; `X-Event-ID` makes retries idempotent        |
| `POST` | `/track/like?slug=<pet-id>`    | Count at most one like per source IP and pet                            |
| `GET`  | `/stats`                       | Return lifetime counters, seven-day counters, and stable trending ranks |

The API never stores raw IP addresses or client event IDs. Metric receipts are salted and hashed before short-lived deduplication. Likes store only a salted, pet-scoped IP hash so the same IP cannot like one pet twice and cannot be correlated across different pets.

## One-time production setup

```bash
cd worker
npm install
npx wrangler login
npx wrangler d1 create awesome-codex-pet-stats-db
```

Put the returned database ID in `wrangler.toml`, then configure the hashing secret and migrate the existing data before deploying:

```bash
openssl rand -hex 32 | npx wrangler secret put HASH_SALT
npm run db:migrate:remote
npm run db:sync -- --remote
npm run deploy
```

`db:sync` reads `../pets.json`, activates current slugs, and imports the largest known lifetime totals from the existing production `/stats` endpoint. Re-running it is safe: it never lowers D1 counters.

## Local development

```bash
npm run db:migrate:local
npm run db:sync -- --local
npm run dev -- --var HASH_SALT:local-development-hash-salt
```

Run checks with:

```bash
npm test
npx wrangler deploy --dry-run
```

To point the web app at the local Worker, set `NEXT_PUBLIC_STATS_API=http://localhost:8787` before starting the web development server.

## Continuous deployment

`.github/workflows/deploy-stats.yml` runs tests, applies D1 migrations, synchronizes the catalog, and deploys the Worker whenever `worker/**` or `pets.json` changes on `main`.

The repository must provide `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets. The token needs Workers Scripts and D1 edit permissions. The `HASH_SALT` value stays attached to the Worker as an encrypted Cloudflare secret and is not stored in GitHub.

## Disabling statistics

Set `AWESOME_CODEX_PET_NO_STATS=1` before running an installer to skip the anonymous install event. Browser detail views use a local anonymous visitor ID only for daily deduplication.
