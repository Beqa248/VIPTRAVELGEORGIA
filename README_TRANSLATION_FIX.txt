COMBINED TRANSLATION PATCH — VIPTravelGeorgia

Includes previous Recent Tours / tour selector fix PLUS the Review form.

Copy files into matching paths in your GitHub repository:
 components/SiteHeader.jsx
 components/pages/tours.jsx
 components/ReviewForm.jsx
 lib/translations.json

Commit and let Vercel redeploy. No Supabase SQL changes needed.
All review form labels, buttons, star options and status messages are translated in EN, KA, RU, HE.
Existing review submission logic and design classes are retained.

Note: Server-generated Supabase error details may remain in English.

ADDITIONAL FIX: components/pages/recent-tours.jsx now translates heading, intro and empty-state text in all four languages. Upload ALL five code files from this ZIP to matching GitHub paths.
