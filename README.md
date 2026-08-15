# Aspen Sundre Real Estate

Public website for Aspen Muraski Real Estate, built with Next.js (App Router) and a custom CMS on top of Sanity.

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in Sanity project id + tokens
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## CMS

Content (listings, testimonials, blog posts/categories) lives in Sanity, but there is **no Sanity Studio** in this project — editing happens through a hand-built admin panel at `/admin`, gated by a single shared password (`ADMIN_PASSWORD`) and an HMAC-signed session cookie (`SESSION_SECRET`). See `.env.example` for the required variables.

- Public pages read published content directly via GROQ (`src/lib/sanity/queries.ts`).
- `/admin/*` pages call `/api/admin/*` route handlers, which use an authenticated `@sanity/client` write token (`SANITY_WRITE_TOKEN`) — never exposed to the browser.
- Document shapes are plain TypeScript types in [`src/lib/sanity/types.ts`](src/lib/sanity/types.ts) (no schema file — that file *is* the schema).
- Blog post bodies are stored as Sanity Portable Text, edited via a Tiptap-based rich text editor in the admin panel and rendered with `@portabletext/react`.

## Importing WordPress content

`scripts/import-wp-export.mjs` one-time-imports the WordPress export in `wp-export/` (listings + blog posts + images) into Sanity:

```bash
npm run import:wp -- --dry-run   # prints a data-quality report, writes nothing
npm run import:wp                # actually imports
```

Safe to re-run — it skips documents whose slug already exists.

## Structure

- `src/app` — public routes + `/admin` (App Router)
- `src/app/api/admin` — authenticated CMS write endpoints
- `src/components` — page sections and UI; `src/components/admin` — admin-only UI
- `src/lib/sanity` — Sanity client, image URLs, GROQ queries, document types
- `src/lib/admin` — admin auth, rich-text (Portable Text ↔ Tiptap) conversion, client fetch helpers
- `src/lib/{listings,blog,testimonials}.ts` — adapters public pages consume, backed by Sanity
