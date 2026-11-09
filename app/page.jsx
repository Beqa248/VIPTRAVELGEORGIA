import Home from "../components/pages/home";
import { getTourCatalog } from "../lib/tourCatalog";

export default async function Page() {
  const tours = await getTourCatalog();
  return <Home tours={tours?.slice(0, 6) ?? null} />;
}