# VIP Travel Georgia — Next.js JavaScript + Supabase-hosted images

This is a **Next.js App Router JavaScript/JSX** project. The 114 original images are **not included**; they are already in your Supabase Storage bucket `website-images`.

## How images work

All existing image references such as `/images/photo-001.jpg`, including CSS hero backgrounds, are preserved. `next.config.mjs` rewrites `/images/:path*` to the **public** Supabase Storage URL. This keeps the original page layout and image assignments without rewriting every component. Images are fetched through the Next.js deployment URL, which proxies them to Supabase. No service-role key is required for public image viewing.

**Important:** The bucket must be public and the uploaded files must be at the bucket root with the same names (for example `photo-001.jpg`, `photo-113.jpg`, `share.jpg`). Check one direct URL before deployment:
`https://YOUR-PROJECT.supabase.co/storage/v1/object/public/website-images/photo-001.jpg`

## GitHub → Vercel deployment

1. Create a GitHub repository or use your existing website repository. **Back up the existing repository/branch first.**
2. Upload **the contents** of this ZIP (not the containing folder) to the repository root. This ZIP has no `public/images` directory. If updating an existing repository, **delete old `public/images` files from GitHub** separately; uploading this ZIP alone will not delete existing files.
3. Open Vercel → Add New → Project → Import Git Repository (or open existing project → Settings → Git and confirm repository).
4. Set Framework Preset: **Next.js**; Root Directory: **./** (unless your files are in a subfolder); Build Command: `npm run build` (default); Install Command: `npm install` (default).
5. In Vercel → Project → Settings → Environment Variables, set `NEXT_PUBLIC_SUPABASE_URL` to the **project URL**, e.g. `https://abcxyz.supabase.co` (no trailing `/`). Enable Production and Preview, and Development if used. **Do not use a secret or service-role key.**
6. Deploy / Redeploy **after** adding the environment variable. Visit `/` and `/cars`, and verify the hero background and photographs. Test `https://YOUR-VERCEL-DOMAIN/images/photo-001.jpg` too.
7. Only promote the deployment to your live domain after reviewing it.

## Local run

Copy `.env.example` to `.env.local`, set the URL, then:

```bash
npm install
npm run dev
```

## Limitations

This is the prior JavaScript/JSX migration with only the image-delivery change. It has not been verified by a complete Next.js production build in this environment. Some original interactive behaviors and translations may still require work; the admin, booking, AI, and payment features are **not guaranteed operational** and real payment processing is not connected. The rewrite does not create an admin media uploader; it only displays your already-uploaded images. New images added to Supabase can be used without including them in a ZIP, but displaying new images in a new page/slot still requires a content or code update unless an admin-driven gallery is built.
