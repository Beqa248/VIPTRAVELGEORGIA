import { headers } from "next/headers";
import { pageMetadata } from "../../lib/seo";
export async function generateMetadata() {
  const requestHeaders = await headers();
  return pageMetadata("/recent-tours", requestHeaders.get("x-vtg-locale") || "en");
}
export default function SeoLayout({children}) {return children;}
