"use client";
import ContactForm from "../ContactForm";

export default function Contact({ initialTour }) {
  return <div data-p="contact"><ContactForm key={initialTour} initialTour={initialTour} /></div>;
}
