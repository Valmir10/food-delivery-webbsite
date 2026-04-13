const API_URL = "http://localhost:3001";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) return {};
  console.log("TOKEN SENT TO BACKEND:", token);

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const fetchCart = async () => {
  const token = localStorage.getItem("token");
  if (!token) return [];

  const res = await fetch(`${API_URL}/cart`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
};

export const addToCart = async (productId, quantity = 1) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_URL}/cart`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ productId, quantity }),
  });

  if (!res.ok) throw new Error("Failed to add to cart");
};

export const updateCartItem = async (productId, quantity) => {
  const res = await fetch(`${API_URL}/cart`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ productId, quantity }),
  });

  if (!res.ok) throw new Error("Failed to update cart");
};

export const removeFromCart = async (productId) => {
  const res = await fetch(`${API_URL}/cart`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    body: JSON.stringify({ productId }),
  });

  if (!res.ok) throw new Error("Failed to remove from cart");
};
