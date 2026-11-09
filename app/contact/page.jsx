import Page from "../../components/pages/contact";

export default async function ContactPage({ searchParams }) {
  const { tour } = await searchParams;
  const initialTour = typeof tour === "string" ? tour.trim() : "";
  return <Page initialTour={initialTour} />;
}
