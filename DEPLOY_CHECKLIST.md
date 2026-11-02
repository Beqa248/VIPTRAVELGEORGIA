# Deployment checklist
1. In Vercel Settings > Environment Variables set NEXT_PUBLIC_SUPABASE_URL to https://YOURPROJECT.supabase.co for Production and Preview. Do not use secret keys.
2. Deploy this repository from the branch you uploaded. Confirm the deployed commit SHA matches GitHub.
3. Test /images/photo-001.jpg. It should return the photograph. A 503 indicates missing project URL; a 404 indicates a missing Supabase object or incorrect path.
4. Test /contact, /reviews, /cars, /tours, /travel directly, then navigate through the header.
5. Test every car tab, translated review button, and tour photograph.
6. Do not replace the live site until the preview deployment passes these checks.

No photographs are bundled. Images must be in public bucket `website-images` with original filenames (photo-001.jpg, etc.) at the bucket root.
This build has not been browser-tested or production-built in this environment.
