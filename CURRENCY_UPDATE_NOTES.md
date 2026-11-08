# VIPTravelGeorgia currency and UI update

- Header currency selector next to language: USD, EUR, GEL. Selection stored locally in the browser.
- Exchange rates are requested via `/api/exchange-rates` from open.er-api.com, cached for one hour. If the service is unavailable, prices remain in their original currency rather than using invented rates.
- Dynamic tour prices on Home, Tours and individual tour pages use the selected display currency. Admin source prices remain unchanged.
- Planner and custom-tour budget labels use the selected currency; submissions include the currency code so the amount is unambiguous.
- Assistant response area is compact; question textarea is larger.
- Georgia Highlights region heading changed to the requested copy.
- Any other prices embedded as unstructured prose or legacy components may require manual review. This is display conversion, not payment currency conversion.
