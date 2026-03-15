# Aspen Country – Vercel Deployment

This folder is the **Aspen Country real estate website**. It includes:
- **Public site** (Aspen green/gold theme): Home, About, Listings, Blog, Contact, etc.
- **CMS** (Bolt theme): `/login` → Bolt-style login → `/admin` with Dashboard, Listings, Testimonials

## Vercel Setup

For `aspen-country.vercel.app` to show this site, the Vercel project must deploy from this folder.

### Steps

1. In [Vercel Dashboard](https://vercel.com), open the project for **aspen-country.vercel.app** (or create it).

2. **Connect to Git** (if not already):
   - Settings → Git → Connect to `managelistella-debug/bolt-real-estate-builder`

3. **Set Root Directory**:
   - Settings → General
   - Find **Root Directory**
   - Set it to: `sites/aspen-country`
   - Save

4. **Deploy**: Push to `main` or click Redeploy. The Aspen site will build and deploy.

### If Root Directory is hard to find

- It may be under **Settings → General → Build & Development Settings**
- Or during **Import Project**: when importing the repo, expand "Configure Project" and set Root Directory to `sites/aspen-country`

Without this setting, Vercel deploys the repo root (the Bolt app) instead of the Aspen site.

### Alternative: Re-import the project

If the project was set up without a root directory:

1. **Vercel Dashboard** → Your project → Settings → General
2. Scroll to **Danger Zone** → **Delete Project** (or create a new project)
3. **Add New** → **Project** → Import `managelistella-debug/bolt-real-estate-builder`
4. **Before** clicking Deploy, expand **Configure Project**
5. Set **Root Directory** to `sites/aspen-country`
6. Deploy
7. Add the domain `aspen-country.vercel.app` to this project
