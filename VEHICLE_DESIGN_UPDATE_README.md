# VIP Travel Georgia — Vehicle cards update

- Homepage cards are compact, two per row, with a clickable photo/name linking to the existing `/cars?car=...` page.
- Vehicle details expands to **Passengers**, **Luggage**, and **A/C** only; no duplicate cards.
- Admin → Vehicles now saves an **Air conditioning (A/C)** checkbox alongside passengers and luggage capacity. The existing description remains editable.
- Georgian, English, Russian, and Hebrew labels are supported.
- All other site pages and components are preserved. The full cars page also shows only these three specs.

## Important deployment step
Run `SUPABASE_VEHICLE_AC_UPDATE.sql` in your existing Supabase project's SQL Editor **before** saving vehicles from the updated Admin panel. This adds the A/C column without removing any data. Then open Admin → Vehicles and tick A/C for vehicles that have air conditioning. Until ticked, A/C is intentionally not displayed.

Deploy the entire project as usual to GitHub / Vercel. Keep your existing Vercel environment variables.
