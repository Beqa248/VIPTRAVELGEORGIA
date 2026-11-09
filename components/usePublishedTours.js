"use client";

import { useEffect, useState } from "react";

let pendingRequest;

function loadTours() {
  pendingRequest ??= fetch("/api/published-tours", { cache: "no-store" })
    .then(async response => {
      if (!response.ok) throw new Error("Unable to load published tours");
      const payload = await response.json();
      return payload.tours || [];
    })
    .finally(() => { pendingRequest = undefined; });
  return pendingRequest;
}

export default function usePublishedTours() {
  const [state, setState] = useState({ tours: [], loading: true, error: false });

  useEffect(() => {
    let active = true;

    async function refresh() {
      try {
        const tours = await loadTours();
        if (active) setState({ tours, loading: false, error: false });
      } catch {
        if (active) setState(previous => ({ ...previous, loading: false, error: true }));
      }
    }

    function refreshWhenVisible() {
      if (document.visibilityState === "visible") refresh();
    }

    refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      active = false;
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  return state;
}
