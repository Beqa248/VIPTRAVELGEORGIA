VIPTravelGeorgia — Lighthouse targeted patch (10 Nov 2026)

Files (copy to the same paths in GitHub):
  components/SiteHeader.jsx
  components/SiteFooter.jsx
  app/layout.jsx
  app/lighthouse-accessibility-fix.css  (NEW)

Fixes:
1. Header/Footer logo is served directly as the existing 15 KB WebP rather than via /_next/image.
   This targets the HTTP 400 error seen in Best Practices.
2. Scoped color contrast changes for the exact homepage elements Lighthouse flagged.
   No layout or functionality changes.

Deployment:
- Upload the 4 files keeping folder paths.
- Wait for Vercel Production Ready.
- Verify https://viptravelgeorgia.com/viptravelgeorgia-round-logo.webp opens.
- Retest mobile and desktop 2-3 times with the same URL/settings.

Important:
- This patch does NOT guarantee a 95+ mobile score; it targets confirmed failures.
- Large images, third-party Supabase cache headers, CSS and JavaScript require separate
  measured improvements. Do not blindly remove CSS/JS, as the site depends on them.
- If the direct WebP URL is unavailable, restore the previous deployment and check public/.
