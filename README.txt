VIPTravelGeorgia — Lighthouse Image Delivery patch

Replace only: components/pages/home.jsx

What changes:
- Home popular-tour cards use existing CardPhoto/Next Image instead of CSS background-image.
- Images can be resized/converted by Next.js Image Optimization, with responsive sizes and lazy loading.
- Existing hero and layout remain unchanged.

Prerequisites: Keep existing components/CardPhoto.jsx, lib/imageSources.mjs and next.config.mjs unchanged.
Vercel NEXT_PUBLIC_SUPABASE_URL must be configured for Supabase remotePatterns.

This addresses image delivery and network payload on Home, not all Lighthouse warnings.
Some Supabase cache warnings and render-blocking CSS require separate work.

After deploy, verify images on Home and retest PageSpeed mobile.
