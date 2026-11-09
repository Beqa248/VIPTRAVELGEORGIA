# VIP Travel Georgia

Next.js App Router website for private tours and transfers in Georgia. It uses
Supabase for published tours, regions, and media. Public pages are available in
English, Georgian, Russian, and Hebrew.

## Local development

1. Use Node.js 22 or the Node.js version configured for the Vercel project.
2. Copy `.env.example` to `.env.local`. For the live catalog and images, set
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` using the
   project's public values. Never put a service-role key in a public variable.
3. Run `npm ci`, then `npm run dev`, and open `http://localhost:3000`.
4. Run `npm run build` to verify the production build.

Original photos at `/images/photo-001.jpg` and similar paths are served from
the public Supabase bucket `website-images`. CMS photos can also come from the
configured project's public `tour-media` bucket. The home and tour catalog use
responsive images; the original files stay in Storage.

The app can build without Supabase configuration. Tour and image availability in
a preview still depends on using the appropriate public project settings.

## Deploying on Vercel

Use the existing linked Vercel project and the Next.js preset, with the repository
root as the project directory. Set the two public Supabase variables for Preview
and Production. Refer to [DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md) before promoting
a branch preview.

The site's canonical origin is `https://viptravelgeorgia.vercel.app`. If the
production hostname changes, update `SITE_URL` in `lib/seo.js` and verify the
sitemap, canonical URLs, and language alternates on the new domain.
