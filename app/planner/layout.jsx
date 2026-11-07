import { PAGE_SEO, seoMetadata } from "../../lib/seo";
const [title, description] = PAGE_SEO["/planner"];
export const metadata = seoMetadata("/planner", title, description);
export default function SeoLayout({ children }) { return children; }
