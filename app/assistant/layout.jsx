import { PAGE_SEO, seoMetadata } from "../../lib/seo";
const [title, description] = PAGE_SEO["/assistant"];
export const metadata = seoMetadata("/assistant", title, description);
export default function SeoLayout({ children }) { return children; }
