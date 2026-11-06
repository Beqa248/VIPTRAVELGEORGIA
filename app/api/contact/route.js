import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
const RECIPIENT = "SubTravelGeorgia@gmail.com";
const clean = (value, max = 4000) => typeof value === "string" ? value.trim().slice(0, max) : "";
export async function POST(request) {
  try {
    const body = await request.json();
    if (clean(body.website)) return Response.json({ ok: true }); // honeypot
    const name = clean(body.name, 100);
    const email = clean(body.email, 180);
    const tour = clean(body.tour, 200);
    const vehicle = clean(body.vehicle, 100);
    const dates = clean(body.dates, 180);
    const message = clean(body.message, 4000);
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !tour || !message || body.consent !== true)
      return Response.json({ error: "Please enter your name, valid email, tour, message, and consent." }, { status: 400 });
    if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM_EMAIL)
      return Response.json({ error: "Email delivery is not configured yet. Please use WhatsApp." }, { status: 503 });
    const lines = [`Name: ${name}`, `Email: ${email}`, `Tour or service: ${tour}`, `Vehicle: ${vehicle}`, `Dates and group size: ${dates}`, "", "Message:", message];
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL, to: [RECIPIENT], reply_to: email, subject: "VIPTravelGeorgia — New website inquiry", text: lines.join("\n") }),
      cache: "no-store"
    });
    if (!response.ok) {
      console.error("Contact email provider failed:", response.status);
      return Response.json({ error: "Email delivery failed. Please try again or use WhatsApp." }, { status: 502 });
    }
    // Persist to the existing admin inquiry table when server credentials are configured.
    let saved = false;
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
        const { error } = await db.from("inquiries").insert({ name, email, destinations: [tour], vehicle, interests: `Dates/group: ${dates}\n${message}`, source: "tour-builder", consent: true, status: "new" });
        if (error) console.error("Inquiry storage failed:", error.message);
        else saved = true;
      } catch (error) { console.error("Inquiry storage error:", error.message); }
    }
    return Response.json({ ok: true, saved });
  } catch { return Response.json({ error: "Unable to process this request." }, { status: 400 }); }
}
