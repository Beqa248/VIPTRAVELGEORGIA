# VIPTravelGeorgia — CMS installation

## Important
Do not merge to `main` until the preview deployment works. This ZIP is based on the uploaded `website-clean-replacement` branch and excludes photo binaries. Existing `/images/photo-XXX.jpg` references still use the current Supabase rewrite.

1. In Supabase SQL Editor run `CMS_MIGRATION.sql` **once**. The existing `supabase-setup.sql` must have been applied previously. This migration adds `videos`, `recent_tours`, and `reviews.tour`, with RLS. It does not delete existing records.
2. In Vercel > Project > Settings > Environment Variables, confirm BOTH `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase public/anon key) exist for **Preview** and **Production**. Do not use a service-role/secret key in `NEXT_PUBLIC_*` variables. Redeploy after changing environment variables.
3. Publish the ZIP files to the `website-clean-replacement` branch, not `main`.
4. Visit `/admin` and sign in as the existing authorized admin. On the Cars tab, click **Enable photo editing** for each existing vehicle. This inserts each vehicle once into the database, retaining its known existing photo URLs. Then click **Edit / Photos** to upload images. New vehicles use **Add car**.
5. Upload a small MP4 through Admin > Videos, publish, then verify `/videos` displays and plays it. Upload a tour gallery through Admin > Recent Tours and verify `/recent-tours` and its header navigation link. Test a new car on `/cars` and homepage.
6. Submit a test review on `/reviews`. Verify it is not publicly visible until approved in Admin > Guest Reviews. Check the homepage reviews too.
7. Test both desktop and mobile. Only then merge into `main`.

## Security and operational notes
- Review submissions are pending by default, enforced by the existing RLS policy. For production spam protection, add CAPTCHA and server-side rate limiting; the current public form does not have them.
- Storage videos are publicly accessible once uploaded; hiding a video removes its listing, **not access to a previously shared direct URL**. Use private buckets/signed URLs if private media is required.
- Video limit is 100 MB per file. Large uploads may need Supabase resumable/TUS uploads depending on network reliability.
- Deleting a content record does not delete its uploaded storage objects; clean up unreferenced files manually if needed.
- Original cars are displayed as fallback until their matching published database record exists. New published cars appear in both homepage and Cars. If you hide a built-in vehicle in Admin, its original fallback remains visible; this intentionally protects existing content.
- The migration assumes your original `admin_users` and `is_site_admin()` function are already set up. Never publish credentials or service-role keys.
