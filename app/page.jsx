import {getTransfers} from "../lib/transfers";
import Home from "../components/pages/home";
import { getTourCatalog } from "../lib/tourCatalog";

export default async function Page() {
  const [tours, transfers] = await Promise.all([getTourCatalog(),getTransfers()]);
  return (
    <>
      {/* Preload the existing CSS hero background so mobile browsers discover it immediately. */}
      <link
        rel="preload"
        as="image"
        href="/images/photo-001.jpg"
        fetchPriority="high"
      />
      <Home transfers={transfers} tours={tours?.slice(0, 6) ?? null} />
    </>
  );
}