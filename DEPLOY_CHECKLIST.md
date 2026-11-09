# Deployment checklist

1. Run `npm ci` and `npm run build`.
2. Push the change branch. Check that Vercel builds the same commit and that the
   preview has both public Supabase variables. Do not use a service-role key.
3. On the preview, open the homepage, catalog, a tour detail, booking, and contact
   on desktop and mobile. Test the menu, language change, search and duration
   filters, and the tour detail link that preselects a tour in the contact form.
4. Check `/images/photo-001.jpg` and the page images. A 503 on the raw image
   indicates missing or invalid Supabase project configuration.
5. Check `/sitemap.xml`, `/robots.txt`, and a localized page's canonical URL
   and language alternates. Canonicals should point to the production hostname.
   Confirm that unpublished tours are absent from the sitemap.
6. Promote to the live site after the preview passes, then confirm the deployed
   commit and check the homepage, catalog, and sitemap on production.
