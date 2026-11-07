import { PAGE_SEO, seoMetadata } from "../../lib/seo";
const [title, description] = PAGE_SEO["/booking"];
export const metadata = seoMetadata("/booking", title, description);
export default function SeoLayout({ children }) { return children; }
