//api.js
console.log("⛳️ API_BASE =", import.meta.env.VITE_API_URL);

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/api/categories`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
