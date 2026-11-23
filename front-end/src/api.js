// Thin wrappers around fetch so pages share one place for API errors.

async function parseResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }
  return data;
}

export function apiGet(path) {
  return fetch(path).then(parseResponse);
}

export function apiPost(path, body) {
  const isForm = body instanceof FormData;
  return fetch(path, {
    method: "POST",
    headers: isForm ? undefined : { "Content-Type": "application/json" },
    body: isForm ? body : JSON.stringify(body),
  }).then(parseResponse);
}
