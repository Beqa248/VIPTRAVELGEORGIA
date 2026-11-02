# Repair notes

- React state now controls vehicle tabs.
- Restored tour preview and travel region images using the original gallery photo-to-destination mapping.
- Restored reviews from original website data.
- Added /contact route and WhatsApp inquiry submission.
- Centered AI feature links.
- Images still use `/images/...` paths proxied by `next.config.mjs` to public Supabase Storage. Set `NEXT_PUBLIC_SUPABASE_URL` on Vercel for the deployment environment, then redeploy.

## Limitations
Not every original JavaScript interaction was ported (e.g. all gallery lightboxes and the trip suggestion widget). Verify Supabase photo URLs and every route in a Vercel Preview deployment before promoting to production.
