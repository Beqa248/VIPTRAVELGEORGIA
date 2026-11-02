
"use client";

import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const text = `Hello! My name is ${name}.\n\n${message}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 20px" }}>
      <h1>Contact us</h1>
      <p>
        Planning a private tour in Georgia? Send us your travel plans
        and we'll help you organize your trip.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 16, maxWidth: 560, marginTop: 24 }}
      >
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: 14, borderRadius: 8, border: "1px solid #ddd" }}
        />

        <textarea
          placeholder="Tell us about your travel plans"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          style={{ padding: 14, borderRadius: 8, border: "1px solid #ddd" }}
        />

        <button
          type="submit"
          style={{
            background: "#008e83",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: 14,
            cursor: "pointer",
            fontWeight: 700
          }}
        >
          Continue to WhatsApp
        </button>
      </form>
    </section>
  );
}
