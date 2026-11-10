VIPTravelGeorgia — Mobile image delivery optimization (changed files only)

Files to replace at repository root:
  components/pages/home.jsx
  components/VehicleCards.jsx
  components/pages/tours.jsx

Changes:
- Home popular-tour backgrounds use the existing CardPhoto/next/image component, retaining layout and links.
- Home vehicle carousel photos use Next Image responsive optimization for configured Supabase or local /images/ sources, preserving a native img fallback for other sources.
- Tours listing supplies responsive sizes for single-column mobile and multi-column desktop.

Requirements:
- Keep existing components/CardPhoto.jsx, lib/imageSources.mjs, next.config.mjs.
- Vercel NEXT_PUBLIC_SUPABASE_URL must be configured for Supabase images.
- This does NOT remove all Lighthouse warnings. The JPG hero and local image cache warnings require the original image files and a versioned asset/cache strategy; CSS blocking needs a separate audit.

Upload only these 3 files into the matching GitHub paths; deploy, then check mobile Home, Tours, car carousel and run PageSpeed 3 times.
