VIP Travel Georgia - minimal patch (homepage + Cars page + deposit translations)

Replace these files at the SAME paths in GitHub:
  components/VehicleCards.jsx
  components/pages/cars.jsx
  lib/translations.json

Run SUPABASE_VEHICLE_FIELDS.sql once in Supabase SQL Editor if the columns are not present.

IMPORTANT: Admin Panel must already be updated from the earlier vehicle patch, with luggage_capacity input and air_conditioning checkbox. If not, also replace app/admin/page.jsx (included here).

Then go to Admin > Vehicles, edit each vehicle, set luggage capacity, and tick A/C for vehicles that have it. Existing rows have blank luggage and A/C=false by default; the UI shows a dash and No until updated.

The homepage horizontal carousel and existing CSS are untouched.
The deposit translations cover EN, KA, RU, HE.
