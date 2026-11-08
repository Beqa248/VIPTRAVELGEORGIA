VIPTravelGeorgia patch — region cover cards, detail galleries, region archive.
1. Run SUPABASE_REGIONS_ARCHIVE_MIGRATION.sql in Supabase SQL Editor FIRST.
2. Upload app/ and components/ files from this ZIP to corresponding GitHub paths.
3. Admin > Georgia Highlights: Archive and Restore; restored items remain unpublished until published.
4. Homepage: cover photo + title only; click card to open /regions/<UUID> with description and photos.
5. Tours archive ALREADY EXISTS in your source: app/admin/tour-photos/NewToursManager.jsx and SUPABASE_ARCHIVED_TOURS.sql. Do not overwrite it. Ensure SUPABASE_ARCHIVED_TOURS.sql was run previously.
6. This patch is based on VIPTRAVELGEORGIA-main (2).zip; if live source has newer changes in these files, merge rather than blindly overwrite.
