import { PAGE_SEO, seoMetadata } from "../../lib/seo";
const [title, description] = PAGE_SEO["/travel"];
export const metadata = seoMetadata("/travel", title, description);
export default function SeoLayout({ children }) { return children; }
