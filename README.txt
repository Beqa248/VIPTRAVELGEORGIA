Remove consent checkbox patch

Replace these two files in the same paths in GitHub:
components/ContactForm.jsx
app/api/contact/route.js

Both homepage and contact page use ContactForm. No SQL required.
The API no longer requires consent and stores consent=false if the optional inquiry logging is enabled.
Direct email still requires RESEND_API_KEY and CONTACT_FROM_EMAIL on Vercel.
