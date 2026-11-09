import TourCatalog from "../../components/pages/tours";
import { getTourCatalog } from "../../lib/tourCatalog";

export default async function ToursPage() {
  const tours = await getTourCatalog();
  return <TourCatalog tours={tours} />;
}
