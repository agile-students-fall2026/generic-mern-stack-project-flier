import { useEffect, useState } from "react";

export function useOrgs({ id = null, enabled = true } = {}) {
  // Shared request state for either the organization list or one organization.
  const [organizations, setOrganizations] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");

  useEffect(() => {
    // Skip the request when the caller does not currently need organizations.
    if (!enabled) {
      return undefined;
    }

    // Abort the request if the hook unmounts or the caller disables it.
    const controller = new AbortController();

    async function fetchOrganizations() {
      setLoading(true);
      setError("");

      try {
        // Use the collection route for the list and the ID route for one organization.
        const endpoint = id
          ? `/api/organizations/${encodeURIComponent(id)}`
          : "/api/organizations";
        const response = await fetch(endpoint, { signal: controller.signal });
        const data = await response.json();
        const hasExpectedData = id
          ? Boolean(data.organization)
          : Array.isArray(data.organizations);
        if (!response.ok || !data.success || !hasExpectedData) {
          throw new Error(data.message || "Could not load organizations.");
        }
        if (id) {
          setOrganization(data.organization);
        } else {
          setOrganizations(data.organizations);
        }
      } catch (fetchError) {
        // Ignore the error if the request was aborted; otherwise show a useful message.
        if (fetchError.name !== "AbortError") {
          setError(fetchError instanceof TypeError
            ? "We're having trouble connecting. Please try again in a moment."
            : fetchError.message || "Could not load organizations.");
        }
      } finally {
        // Only update loading state if this request is still active.
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchOrganizations();
    // Cleanup: abort the request when the effect reruns or the component unmounts.
    return () => controller.abort();
  }, [id, enabled]);

  return { organizations, organization, loading: enabled && loading, error };
}
