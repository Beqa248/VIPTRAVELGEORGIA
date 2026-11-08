export function tourPriceLabel(tour, formatPrice) {
  if (!tour || !tour.price_mode || tour.price_mode === "hidden") return "";
  if (tour.price_mode === "request") return "Price on request";
  if (tour.price_mode !== "starting") return "";
  const amount = Number(tour.price_amount);
  if (!Number.isFinite(amount) || amount <= 0) return "";
  const symbol = { USD:"$", EUR:"€", GEL:"₾" }[tour.price_currency] || "$";
  const unit = { car:"car", person:"person", group:"group" }[tour.price_unit] || "car";
  return `From ${formatPrice ? formatPrice(amount, tour.price_currency || "USD") : symbol+amount.toLocaleString("en-US")} / ${unit}`;
}
