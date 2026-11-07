import { PAGE_SEO, seoMetadata } from "../../lib/seo";
const [title, description] = PAGE_SEO["/recent-tours"];
export const metadata = seoMetadata("/recent-tours", title, description);
export default function SeoLayout({ children }) { return children; }
