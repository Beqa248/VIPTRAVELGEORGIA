import { SITE_URL } from "../lib/seo";
export default function SeoBusinessJsonLd() {
 const data={"@context":"https://schema.org","@type":"TravelAgency",name:"VIPTravelGeorgia",url:SITE_URL,telephone:"+995558176108",email:"SubTravelGeorgia@gmail.com",description:"Private tours and transfers in Georgia",areaServed:{"@type":"Country",name:"Georgia"}};
 return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,"\\u003c")}} />;
}
