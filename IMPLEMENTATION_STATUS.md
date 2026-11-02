# Implementation status — preview candidate

This is a real Next.js App Router JavaScript/JSX source project, not the interactive chat preview.

Changes in this candidate:
- Car selection mounts only the active car section in React, avoiding hidden CSS panel conflicts.
- GalleryLightbox adds click-to-preview for original gallery photographs and tour-card background photographs; arrow keys and Escape supported.
- Contact, Reviews, Travel, Cars, and Tours remain explicit Next.js routes from the prior codebase.
- ReviewsList reads the original review JSON data, including translation toggles where translated text is present.
- Supabase Storage images continue through the existing `/images/[...path]` route. Configure `NEXT_PUBLIC_SUPABASE_URL` in Vercel.

Verification performed: JS/JSX syntax/transpilation check and ZIP archive integrity. npm registry access timed out; a complete `next build` and browser interaction tests have NOT been completed. Do not treat this as production-verified.

Known limits: the two Mercedes galleries have no images in the original source. Additional original-page dynamic scripts may still need migration.
