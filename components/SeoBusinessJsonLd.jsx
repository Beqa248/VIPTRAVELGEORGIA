import { SITE_URL } from "../lib/seo";
export default function SeoBusinessJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${SITE_URL}/#organization`,
    name: "VIPTravelGeorgia",
    url: SITE_URL,
    logo: `${SITE_URL}/viptravelgeorgia-round-logo.png`,
    telephone: "+995558176108",
    email: "SubTravelGeorgia@gmail.com",
    description: "Private tours and transfers in Georgia",
    areaServed: { "@type": "Country", name: "Georgia" },
    sameAs: ["https://www.instagram.com/viptravelgeorgia/"],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{
    __html: JSON.stringify(organization).replace(/</g, "\\u003c"),
  }} />;
}
