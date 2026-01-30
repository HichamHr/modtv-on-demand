# ModTV QA Checklist (Manual)

Use this checklist before adding new features. Record results and any issues.

## Prereqs
- Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Have at least one test account (email + password).
- Run the app locally: `npm run dev`.

## Auth Flow (SSR)
1) Visit `/login` while logged out.
   - Expect: login form renders with email/password fields.
2) Submit valid credentials.
   - Expect: redirect to `/dashboard`.
3) Visit `/login` while logged in.
   - Expect: redirect to `/dashboard`.
4) Sign out from `/dashboard`.
   - Expect: redirect to `/login` or UI updates to logged-out state.
5) Visit `/dashboard` while logged out.
   - Expect: redirect to `/login`.

## Channel Flow
1) From `/dashboard`, click **Create Channel**.
2) Enter name + slug and submit.
   - Expect: redirect to `/dashboard/[slug]`.
3) Refresh `/dashboard`.
   - Expect: channel list contains the new channel + role.
4) Attempt to access `/dashboard/[slug]` for a channel you are not a member of.
   - Expect: redirect to `/dashboard?error=forbidden`.

## Public Storefront
1) Visit `/{slug}` for a valid channel.
   - Expect: channel hero renders, published videos only.
2) Visit `/{slug}/videos/[id]` for a published video that belongs to that channel.
   - Expect: video detail page renders.
3) Visit `/{slug}` for a non-existent channel.
   - Expect: public Not Found page.
4) Visit `/{slug}/videos/[id]` with a valid video id but wrong slug.
   - Expect: Not Found page (tenant safety).

## Video CRUD (Dashboard)
1) Visit `/dashboard/[slug]/videos` as **owner/admin**.
   - Expect: list renders with existing videos.
2) Create a new video with required fields only.
   - Expect: appears as Draft.
3) Edit the video title/description.
   - Expect: updates are visible in list.
4) Delete flow (if implemented).
   - Expect: item removed (skip if not available).

## Publish / Unpublish
1) From `/dashboard/[slug]/videos`, publish a draft.
   - Expect: status changes to Published; storefront now shows it.
2) Unpublish the video.
   - Expect: status changes to Draft; storefront no longer shows it.

## Premium / Free Display
1) Create a premium video with price (cents) and publish it.
   - Expect: storefront shows premium badge + price.
2) Open its public detail page.
   - Expect: Paywall card is displayed (no full video access).
3) Create a free video and publish it.
   - Expect: public detail page shows full video section.

## 404s and Unauthorized Access
1) Visit `/dashboard` while logged out.
   - Expect: redirect to `/login`.
2) Visit `/dashboard/[slug]/videos` as **viewer**.
   - Expect: redirect to `/dashboard?error=forbidden`.
3) Try loading another tenant's video id on a different channel slug.
   - Expect: Not Found page.

## Regression Quick Checks
- No drafts appear on public pages.
- Slug normalization trims + lowercases; uniqueness enforced.
- Revalidation updates public pages after publish/unpublish.
