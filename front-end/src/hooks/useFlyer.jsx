import { useCallback, useEffect, useState } from "react";

export function useFlyer(id) {
  // Keep the requested flyer and its loading or error state together.
  const [flyer, setFlyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch one flyer from the ID-specific route.
  const fetchFlyer = useCallback(async (signal) => {
    // A missing ID cannot produce a valid detail request.
    if (!id) {
      setFlyer(null);
      setError("Flyer not found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      // The signal lets the effect cancel a stale request if the ID changes.
      const response = await fetch(`/api/flyers/${encodeURIComponent(id)}`, { signal });
      const data = await response.json();
      // Check both the HTTP status and the API response shape before saving the flyer.
      if (!response.ok || !data.success || !data.flyer) {
        throw new Error(data.message || "Could not load flyer.");
      }
      setFlyer(data.flyer);
    } catch (fetchError) {
      // Ignore aborted requests; report connection and API errors to the page.
      if (fetchError.name !== "AbortError") {
        setFlyer(null);
        setError(fetchError instanceof TypeError
          ? "We're having trouble connecting. Please try again in a moment."
          : fetchError.message || "Could not load flyer.");
      }
    } finally {
      // Do not update state after this request has been cancelled.
      if (!signal?.aborted) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // Cancel the previous request when the ID changes or the page unmounts.
    const controller = new AbortController();
    fetchFlyer(controller.signal);
    return () => controller.abort();
  }, [fetchFlyer]);

  // Send edits to the ID-specific PUT route and keep the returned flyer in sync.
  const updateFlyer = useCallback(async (updates) => {
    const response = await fetch(`/api/flyers/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    // Surface API validation errors so the form can display them.
    if (!response.ok || !data.success || !data.flyer) {
      throw new Error(data.message || "Could not update flyer.");
    }
    setFlyer(data.flyer);
    return data.flyer;
  }, [id]);

  return { flyer, loading, error, updateFlyer };
}
