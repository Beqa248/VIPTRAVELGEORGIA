import { PAGE_SEO, seoMetadata } from "../../lib/seo";
const [title, description] = PAGE_SEO["/tours"];
export const metadata = seoMetadata("/tours", title, description);
export default function SeoLayout({ children }) { return children; }
