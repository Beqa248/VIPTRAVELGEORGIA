import { PAGE_SEO, seoMetadata } from "../../lib/seo";
const [title, description] = PAGE_SEO["/cars"];
export const metadata = seoMetadata("/cars", title, description);
export default function SeoLayout({ children }) { return children; }
