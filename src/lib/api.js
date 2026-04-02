export const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const apiFetch = async (path, options = {}) => {
  const url = `${API_BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data.message || "Request failed";
    throw new Error(message);
  }
  return data;
};
