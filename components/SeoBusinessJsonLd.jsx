import { SITE_URL } from "../lib/seo";
export default function SeoBusinessJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${SITE_URL}/#organization`,
    name: "VIP Tours Georgia",
    alternateName: "VIPToursGeorgia",
    url: `${SITE_URL}/en`,
    logo: `${SITE_URL}/viptravelgeorgia-round-logo.png`,
    telephone: "+995558176108",
    email: "SubTravelGeorgia@gmail.com",
    description: "Private tours and transfers in Georgia",
    areaServed: { "@type": "Country", name: "Georgia" },
    sameAs: ["https://www.instagram.com/viptravelgeorgia/"],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{
    __html: JSON.stringify([organization, { "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/en`, name: "VIP Tours Georgia", alternateName: "VIPToursGeorgia", publisher: { "@id": `${SITE_URL}/#organization` } }]).replace(/</g, "\\u003c"),
  }} />;
}
