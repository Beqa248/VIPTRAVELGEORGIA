VIPTravelGeorgia — SEO Phase 2 patch

ატვირთე მხოლოდ ეს ორი ფაილი GitHub-ში ზუსტად იმავე მისამართებით:
lib/seo.js
components/TourSeoJsonLd.jsx

არ წაშალო სხვა ფაილები. README-GE.txt არ არის აუცილებელი ასატვირთად.

ცვლილებები:
- canonical/sitemap/social URL fallback: https://viptravelgeorgia.com
- ტურის SEO title და description ავტომატური fallback, როცა აღწერა ცარიელია
- მოკლე SEO title, რათა ბრენდის დამატებით ძალიან არ დაგრძელდეს
- ოთხენოვანი BreadcrumbList labels

მნიშვნელოვანია: NEXT_PUBLIC_SITE_URL Vercel-ზე უნდა იყოს https://viptravelgeorgia.com.
საიტის დიზაინი და sitemap უცვლელია.
