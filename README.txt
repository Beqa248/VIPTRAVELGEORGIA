VIPTravelGeorgia - Supabase upload cache patch

Replace only the 4 files at their exact paths in GitHub.
New tour-media images get cacheControl 86400 (24 hours). Video uploads are unchanged.
Existing images are NOT modified. This patch does NOT compress images or guarantee a PageSpeed increase.
No Supabase bucket settings need changing.
