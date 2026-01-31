This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase Migrations

This project manages database schema changes via SQL migrations in `supabase/migrations/`.

### Install and initialize the Supabase CLI

```bash
npm install -D supabase
npx supabase init
```

### Link to your Supabase project

Replace `<your-project-ref>` with your Supabase project ref:

```bash
npx supabase link --project-ref <your-project-ref>
```

Note: This does not commit secrets. Keep your Supabase keys in `.env` (already ignored by git).

### Run migrations locally

Start the local Supabase stack, then reset the DB (runs migrations and seed):

```bash
npx supabase start
npx supabase db reset
```

### Push migrations to the remote project

```bash
npx supabase db push
```

Safety note: avoid running `supabase db push` directly on production unless you have reviewed the migration output and have a rollback plan.

### Seed data (optional)

`supabase/seed.sql` inserts a demo channel and videos. It runs automatically with `supabase db reset`.

## CI Setup

GitHub Actions runs lint, typecheck, and Playwright smoke tests on every push and PR.

Required GitHub Secrets:
- `E2E_EMAIL`: test user email for smoke tests.
- `E2E_PASSWORD`: test user password for smoke tests.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL used during CI build and E2E.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key used during CI build and E2E.

Troubleshooting:
- If the build fails on `/login` or `/signup` with "Missing Supabase environment variables", confirm the two `NEXT_PUBLIC_SUPABASE_*` secrets are set in the repo.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
