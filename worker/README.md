# awesome-codex-pet-stats Worker

Cloudflare Worker that records privacy-conscious install and like actions for the Awesome Codex Pet gallery.

- **Production URL**: `https://api.codexpet.top`
- **Storage**: Cloudflare D1 (`DB` binding)
- **Public reads**: static `web/public/stats.json`, exported from D1 during web deployment
- **Cleanup**: daily Cron Trigger removes expired event receipts and rate-limit buckets
- **Public Worker surface**: custom domain only; `workers.dev` and preview URLs are disabled

## Endpoints

| Method | Path                           | Purpose                                                          |
| ------ | ------------------------------ | ---------------------------------------------------------------- |
| `POST` | `/track/install?slug=<pet-id>` | Count a completed install; `X-Event-ID` makes retries idempotent |
| `POST` | `/track/like?slug=<pet-id>`    | Count at most one like per source IP and pet                     |

The API never stores raw IP addresses or client event IDs. Metric receipts are salted and hashed before short-lived deduplication. Likes store only a salted, pet-scoped IP hash so the same IP cannot like one pet twice and cannot be correlated across different pets.

Normal page loads never invoke this Worker. Browsers read the deployment-time `/stats.json` snapshot from Cloudflare Pages as a free static asset, and pet detail views are not written to D1.

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
npm run db:export -- --remote
npm run deploy
```

`db:sync` reads `../pets.json` and activates current slugs without lowering existing counters. For a one-time migration from a legacy JSON endpoint, pass `--stats-url <url>` explicitly.

`db:export` queries D1 through Wrangler and atomically writes `../web/public/stats.json`. The web deployment workflows run it once before building Pages, so statistics update when the site is deployed rather than on every page request.

## Local development

```bash
npm run db:migrate:local
npm run db:sync -- --local
npm run db:export -- --local
npm run dev -- --var HASH_SALT:local-development-hash-salt
```

Run checks with:

```bash
npm test
npx wrangler deploy --dry-run
```

To test likes against the local Worker, set `NEXT_PUBLIC_STATS_WRITE_API=http://localhost:8787` before starting the web development server. Statistics displayed by the site still come from the static `web/public/stats.json` snapshot.

## Continuous deployment

`.github/workflows/deploy-stats.yml` runs tests, applies D1 migrations, synchronizes the catalog, and deploys the write-only Worker whenever `worker/**` or `pets.json` changes on `main`. Both web deployment workflows export the latest D1 snapshot before building Pages.

The repository must provide `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets. The token needs Workers Scripts and D1 edit permissions. The `HASH_SALT` value stays attached to the Worker as an encrypted Cloudflare secret and is not stored in GitHub.

## Disabling statistics

Set `AWESOME_CODEX_PET_NO_STATS=1` before running an installer to skip the anonymous install event. Browser detail views are not recorded.
