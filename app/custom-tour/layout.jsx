import { PAGE_SEO, seoMetadata } from "../../lib/seo";
const [title, description] = PAGE_SEO["/custom-tour"];
export const metadata = seoMetadata("/custom-tour", title, description);
export default function SeoLayout({ children }) { return children; }
