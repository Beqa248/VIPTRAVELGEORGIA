import { PAGE_SEO, seoMetadata } from "../../lib/seo";
const [title, description] = PAGE_SEO["/reviews"];
export const metadata = seoMetadata("/reviews", title, description);
export default function SeoLayout({ children }) { return children; }
