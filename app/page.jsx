import Home from "../components/pages/home";
import { getTourCatalog } from "../lib/tourCatalog";

export default async function Page() {
  const tours = await getTourCatalog();
  return (
    <>
      {/* Preload the existing CSS hero background so mobile browsers discover it immediately. */}
      <link
        rel="preload"
        as="image"
        href="/images/photo-001.jpg"
        fetchPriority="high"
      />
      <Home tours={tours?.slice(0, 6) ?? null} />
    </>
  );
}