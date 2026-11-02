
"use client";

import ReviewsList from "../ReviewsList";
import ReviewForm from "../ReviewForm";
import { useLanguage } from "../site-context";

export default function Page() {
  const { t } = useLanguage();

  return (
    <div data-p="reviews">
      <section id="rev" className="why">
        <div className="wrap">
          <h2 data-k="revH">{t("revH")}</h2>

          <ReviewsList />
          <ReviewForm />

          <p id="gyg" style={{ marginTop: "16px" }}></p>
        </div>
      </section>
    </div>
  );
}
