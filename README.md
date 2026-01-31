# ModTV On Demand

Multi-tenant VOD platform built with Next.js App Router and Supabase.

## Features
- Supabase Auth SSR (login/signup/logout) with protected dashboard.
- Multi-tenant channels with roles (owner/admin/viewer).
- Channel creation with slug normalization + uniqueness.
- Public storefront per channel showing published videos only.
- Public video detail validates channel ownership + published state.
- Dashboard video CRUD with publish toggle.
- Premium video paywall UI placeholder (no payments yet).
- Playwright smoke tests + CI quality checks.

## Quick Start
1) Create `.env`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
2) Install + run:
```
npm install
npm run dev
```
Open `http://localhost:3000`.

## Tests
Typecheck:
```
npm run typecheck
```
Lint:
```
npm run lint
```
E2E (requires a test user):
```
E2E_EMAIL=user@user.com
E2E_PASSWORD=00000000
E2E_BASE_URL=http://localhost:3000
npm run test:e2e
```

## Supabase Migrations
```
npm install -D supabase
npx supabase init
npx supabase link --project-ref <your-project-ref>
npx supabase start
npx supabase db reset
```
`supabase/seed.sql` inserts a demo channel and videos.

## CI Setup
GitHub Actions runs lint, typecheck, build, and Playwright smoke tests.

Required GitHub Secrets:
- `E2E_EMAIL`
- `E2E_PASSWORD`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Troubleshooting:
- Build fails on `/login` or `/signup`: verify `NEXT_PUBLIC_SUPABASE_*` secrets exist in GitHub.
- `Invalid Refresh Token: Already Used`: clear site cookies or use an incognito window.
