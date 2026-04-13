import { API_BASE, USE_MOCK } from "../config/api";
import seedProducts from "../data/seedProducts";

export const getProducts = async () => {
  if (USE_MOCK) {
    return seedProducts;
  }

  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};