const API_BASE = "http://127.0.0.1:8000/api";

export function getAdminKey() {
  return localStorage.getItem("ADMIN_KEY") || "";
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    let errorMsg = `Error ${res.status}: ${res.statusText}`;
    try {
      const errorData = await res.json();
      // Handle Laravel simplified error structure or generic message
      errorMsg = errorData.message || errorData.error || JSON.stringify(errorData);
    } catch (e) {
      // Fallback if not JSON
      const text = await res.text();
      if (text) errorMsg = text;
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export async function apiAdmin(path, { method = "POST", body } = {}) {
  const key = getAdminKey();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-ADMIN-KEY": key,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("ADMIN_KEY");
      window.dispatchEvent(new Event("admin-unauthorized"));
      throw new Error("Unauthorized");
    }

    let errorMsg = `Error ${res.status}: ${res.statusText}`;
    try {
      const errorData = await res.json();
      // Laravel validation errors often come as { message: "...", errors: { ... } }
      if (errorData.message) {
        errorMsg = errorData.message;
      } else if (errorData.error) {
        errorMsg = errorData.error;
      } else {
        errorMsg = JSON.stringify(errorData);
      }
    } catch (e) {
      const text = await res.text();
      if (text) errorMsg = text;
    }
    throw new Error(errorMsg);
  }
  if (res.status === 204) return {};
  return res.json();
}
