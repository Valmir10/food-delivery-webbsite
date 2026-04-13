import { API_BASE, USE_MOCK } from "../config/api";
import seedProducts from "../data/seedProducts";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const getMockCart = () => {
  return JSON.parse(localStorage.getItem("mock_cart") || "[]");
};

const saveMockCart = (cart) => {
  localStorage.setItem("mock_cart", JSON.stringify(cart));
};

export const fetchCart = async () => {
  const token = localStorage.getItem("token");
  if (!token) return [];

  if (USE_MOCK) {
    return getMockCart();
  }

  const res = await fetch(`${API_BASE}/cart`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
};

export const addToCart = async (productId, quantity = 1) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  if (USE_MOCK) {
    const cart = getMockCart();
    const existing = cart.find((item) => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      const product = seedProducts.find((p) => p.id === productId);
      if (product) {
        cart.push({
          id: Date.now(),
          productId: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          quantity,
        });
      }
    }
    saveMockCart(cart);
    return;
  }

  const headers = getAuthHeaders();
  console.log("ADD TO CART:", { url: `${API_BASE}/cart`, productId, quantity, hasToken: !!headers.Authorization });

  const res = await fetch(`${API_BASE}/cart`, {
    method: "POST",
    headers,
    body: JSON.stringify({ productId, quantity }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("ADD TO CART FAILED:", res.status, text);
    throw new Error(`Failed to add to cart (${res.status})`);
  }
};

export const updateCartItem = async (productId, quantity) => {
  if (USE_MOCK) {
    const cart = getMockCart();
    const index = cart.findIndex((item) => item.productId === productId);
    if (index !== -1) {
      if (quantity <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = quantity;
      }
    }
    saveMockCart(cart);
    return;
  }

  const res = await fetch(`${API_BASE}/cart`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ productId, quantity }),
  });

  if (!res.ok) throw new Error("Failed to update cart");
};

export const removeFromCart = async (productId) => {
  if (USE_MOCK) {
    const cart = getMockCart().filter((item) => item.productId !== productId);
    saveMockCart(cart);
    return;
  }

  const res = await fetch(`${API_BASE}/cart`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    body: JSON.stringify({ productId }),
  });

  if (!res.ok) throw new Error("Failed to remove from cart");
};

export const clearCart = async () => {
  if (USE_MOCK) {
    saveMockCart([]);
    return;
  }

  const cart = await fetchCart();
  for (const item of cart) {
    await removeFromCart(item.productId);
  }
};