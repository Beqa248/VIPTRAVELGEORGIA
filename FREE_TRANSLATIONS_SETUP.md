# VIPTravelGeorgia — free translations update

1. In Supabase > SQL Editor, run `SUPABASE_FREE_TRANSLATIONS.sql` once.
2. Upload the changed code files to GitHub (or deploy the full updated ZIP).
3. No Google Cloud key or billing account is required.
4. In Admin > Tours > Add New Tour (or Edit), enter English title, description and itinerary.
5. Click **Generate translations — free**, review/edit the Georgian, Russian and Hebrew fields, then **Save tour**.
6. Existing tours need translations generated once each. Future tours need the same Generate step before saving.

The free MyMemory API is a third-party service. Its availability, language coverage, daily character limits, and quality are not guaranteed. If a language fails, no fabricated translation is saved; retry or enter the text manually. Set optional server-only `MYMEMORY_CONTACT_EMAIL` in Vercel if you want the provider's email-associated allowance. Do not use a NEXT_PUBLIC_ prefix.

Static Contact form labels are translated locally and need no API. Public tour detail titles and descriptions use saved translations when present. Other dynamic fields/cards can fall back to live best-effort translations and are not guaranteed translated when the provider is unavailable. Translation cache in the API is in-memory only (not persistent across serverless instances); saved tour translations in Supabase are persistent.

This patch does not modify the existing design or delete Supabase records. Test the Vercel Preview deployment and all four languages before production release.
