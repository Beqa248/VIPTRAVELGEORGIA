# VIP Travel Georgia — Next.js JavaScript Edition

This project uses Next.js App Router with JavaScript/JSX source, not TypeScript. Original photos are in public/images/.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. Build with `npm run build`. Deploy to Vercel with framework Next.js and root directory /.

## Features and limitations

Original site pages were migrated from Claude's HTML into JSX. Admin, booking, AI planner, and AI assistant routes are present, but require environment setup and live testing. Real payment collection is not connected. Check design and translations in a Vercel preview before production deployment.

Supabase setup: see supabase-setup.sql and .env.example. Never put private API keys into NEXT_PUBLIC_ variables.

Images are included in public/images/.
