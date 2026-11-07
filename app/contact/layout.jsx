import { PAGE_SEO, seoMetadata } from "../../lib/seo";
const [title, description] = PAGE_SEO["/contact"];
export const metadata = seoMetadata("/contact", title, description);
export default function SeoLayout({ children }) { return children; }
