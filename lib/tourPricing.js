export const tourPriceLabels = {
  en: { request: "Price on request", from: "From", car: "car", person: "person", group: "group" },
  ka: { request: "ფასი მოთხოვნით", from: "საწყისი ფასი:", car: "მანქანა", person: "ადამიანი", group: "ჯგუფი" },
  ru: { request: "Цена по запросу", from: "От", car: "машина", person: "человек", group: "группа" },
  he: { request: "מחיר לפי בקשה", from: "החל מ־", car: "רכב", person: "אדם", group: "קבוצה" },
};

export function tourPriceLabel(tour, formatPrice, labels = {}) {
  if (!tour || !tour.price_mode || tour.price_mode === "hidden") return "";
  if (tour.price_mode === "request") return labels.request || "Price on request";
  if (tour.price_mode !== "starting") return "";
  const amount = Number(tour.price_amount);
  if (!Number.isFinite(amount) || amount <= 0) return "";
  const symbol = { USD: "$", EUR: "€", GEL: "₾" }[tour.price_currency] || "$";
  const unit = ["car", "person", "group"].includes(tour.price_unit) ? tour.price_unit : "car";
  const price = formatPrice ? formatPrice(amount, tour.price_currency || "USD") : symbol + amount.toLocaleString("en-US");
  return `${labels.from || "From"} ${price} / ${labels[unit] || unit}`;
}
