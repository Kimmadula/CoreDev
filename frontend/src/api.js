const API_BASE = "http://127.0.0.1:8000/api";

export function getAdminKey() {
  return localStorage.getItem("ADMIN_KEY") || "";
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiAdmin(path, { method = "POST", body } = {}) {
  const key = getAdminKey();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-ADMIN-KEY": key,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
