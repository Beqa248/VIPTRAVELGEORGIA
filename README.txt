ARCHIVED TOURS - CONFIRMED UPDATE

Run SUPABASE_ARCHIVED_TOURS.sql in Supabase SQL Editor first.
Upload the six code files to matching paths.
Admin > Tours > Existing Tours > Archive tour; the tour is then listed in Admin > Tours > Archived Tours.
Admin > Tours > Create & Manage New Tours > Archive; it also moves to Archived Tours.
Restore moves the tour back as a draft, not immediately public.
Original hardcoded tours are archived by creating/updating a custom_tours record with their slug; original files are not deleted.
Do not upload README or SQL into Next.js source folders.
Admin header and navigation are not modified.
ZIP integrity checked, but no full npm build or Supabase integration test performed.
