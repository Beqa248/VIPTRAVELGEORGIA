import { headers } from "next/headers";
import { PAGE_SEO, localizedMetadata } from "../../lib/seo";
export async function generateMetadata() {
 const h=await headers(); const lang=h.get("x-vtg-locale") || "en";
 const [title,description]=PAGE_SEO["/reviews"];
 return localizedMetadata("/reviews",title,description,undefined,lang);
}
export default function SeoLayout({children}) {return children;}
