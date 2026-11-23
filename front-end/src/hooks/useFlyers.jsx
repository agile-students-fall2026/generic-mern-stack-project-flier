import { useCallback, useEffect, useState } from "react";

export function useFlyers(filter = "") {
  // Shared request state for the current flyer list and any form submission.
  const [currFilter, setFilter] = useState(filter);
  const [flyers, setFlyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [refetchIndex, setRefetchIndex] = useState(0);

  // Incrementing this value asks the GET effect below to fetch the list again.
  const refetch = useCallback(() => {
    setRefetchIndex((index) => index + 1);
  }, []);

  useEffect(() => {
    // Abort an older request if the filter changes or this hook unmounts.
    const controller = new AbortController();
    let loadingTimeout;

    async function fetchFlyers() {
      // Delay the loading indicator to avoid flashing it for quick responses.
      loadingTimeout = setTimeout(() => setLoading(true), 300);
      setError("");

      // Read in a category query and apply it if needed
      const query = currFilter ? `?category=${encodeURIComponent(currFilter)}` : "";

      try {
        // Controller lets us cancel if the page unmounts or the category changes before it finishes
        const response = await fetch(`/api/flyers${query}`, {
          signal: controller.signal,
        });

        const data = await response.json();

        // If something goes wrong, use the message provided in the response
        // or send a default response if for some reason the backend didn't catch an error/isn't active
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Could not load flyers.");
        }
        
        setFlyers(data.flyers);
      } catch (fetchError) {
        // Ignore the error if the request was aborted
        if (fetchError.name !== "AbortError") {
          setError(fetchError instanceof TypeError
            ? "We're having trouble connecting. Please try again in a moment."
            : fetchError.message || "Could not load flyers.");
        }
      } finally {
        // Cleanup: clear timer, hide loading indicator if request wasn't cancelled
        clearTimeout(loadingTimeout);
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchFlyers();
    // Cleanup: ran when component unmounts or before effect runs again 
    return () => {
      controller.abort();
      clearTimeout(loadingTimeout);
    };
    // currFilter and refetchIndex trigger the effect to rerun when these values change
  }, [currFilter, refetchIndex]);

  // POST a flyer using the backend's flyer fields, then update this list locally.
  const addFlyer = useCallback(async (flyer) => {
    setPosting(true);
    setError("");

    try {
      const response = await fetch("/api/flyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flyer),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not post flyer.");
      }

      // Update local list sorted in starts_at order
      if (!currFilter || data.flyer.categories?.includes(currFilter)) {
        setFlyers((current) => [...current, data.flyer].sort(
          (a, b) => Date.parse(a.starts_at) - Date.parse(b.starts_at),
        ));
      }

      return data.flyer;
    } catch (postError) {
      const message = postError instanceof TypeError
        ? "We're having trouble connecting. Please try again in a moment."
        : postError.message || "Could not post flyer.";
      setError(message);
      throw new Error(message, { cause: postError });
    } finally {
      setPosting(false);
    }
  }, [currFilter]);

  return {
    currFilter,
    setFilter,
    flyers,
    loading,
    posting,
    error,
    refetch,
    addFlyer,
  };
}
