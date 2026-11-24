import { useEffect, useRef, useState } from "react";
import { CURRENT_USER_ID } from "../constants/currentUser";

export function useFavorites() {
  // Keep favorite IDs separate from the full club objects returned by the API.
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [storedFavoriteClubs, setStoredFavoriteClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Prevent overlapping requests for one organization while other IDs update.
  const pendingIds = useRef(new Set());

  useEffect(() => {
    // Abort the initial request if this page unmounts before it finishes.
    const controller = new AbortController();

    async function fetchFavorites() {
      setLoading(true);
      setError("");

      try {
        // Load favorite IDs and matching organization objects for the mock user.
        const response = await fetch(`/api/users/${CURRENT_USER_ID}/favorites`, {
          signal: controller.signal,
        });
        const data = await response.json();
        // Check the response shape before storing the API data.
        if (!response.ok || !data.success || !Array.isArray(data.favoriteOrganizationIds)
          || !Array.isArray(data.organizations)) {
          throw new Error(data.message || "Could not load favorite organizations.");
        }
        setFavoriteIds(data.favoriteOrganizationIds.map((id) => String(id)));
        setStoredFavoriteClubs(data.organizations);
      } catch (fetchError) {
        // Ignore cancelled requests and show a useful message for other failures.
        if (fetchError.name !== "AbortError") {
          setError(fetchError instanceof TypeError
            ? "We're having trouble connecting. Please try again in a moment."
            : fetchError.message || "Could not load favorite organizations.");
        }
      } finally {
        // Avoid updating state after this request has been cancelled.
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchFavorites();
    // Cancel the request when the page unmounts.
    return () => controller.abort();
  }, []);

  // Compare IDs as strings because mock data may use different ID types.
  function isFavorite(orgId) {
    return favoriteIds.some((id) => id === String(orgId));
  }

  async function toggleFavorite(orgId) {
    const favoriteId = String(orgId);
    // Ignore another click for this ID until its current request finishes.
    if (pendingIds.current.has(favoriteId)) {
      return;
    }

    pendingIds.current.add(favoriteId);
    setError("");
    const isAdding = !isFavorite(favoriteId);
    // Update the UI immediately while the server saves the change.
    setFavoriteIds((currentIds) => {
      if (isAdding) {
        return currentIds.some((id) => String(id) === favoriteId)
          ? currentIds
          : [...currentIds, favoriteId];
      }
      return currentIds.filter((id) => String(id) !== favoriteId);
    });

    try {
      // Use POST to add a favorite and DELETE to remove one.
      const response = await fetch(
        `/api/users/${CURRENT_USER_ID}/favorites/${encodeURIComponent(orgId)}`,
        { method: isAdding ? "POST" : "DELETE" },
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not update favorites.");
      }
    } catch (fetchError) {
      // Revert only this ID so overlapping changes to other organizations remain intact.
      setFavoriteIds((currentIds) => {
        if (isAdding) {
          return currentIds.filter((id) => String(id) !== favoriteId);
        }
        return currentIds.some((id) => String(id) === favoriteId)
          ? currentIds
          : [...currentIds, favoriteId];
      });
      setError(fetchError instanceof TypeError
        ? "We're having trouble connecting. Please try again in a moment."
        : fetchError.message || "Could not update favorites.");
    } finally {
      pendingIds.current.delete(favoriteId);
    }
  }

  const favoriteClubs = storedFavoriteClubs.filter((club) =>
    favoriteIds.some((id) => id === String(club.id))
  );

  return { favoriteIds, favoriteClubs, isFavorite, toggleFavorite, loading, error };
}
