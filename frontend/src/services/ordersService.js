import { API_BASE, USE_MOCK } from "../config/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const checkout = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  if (USE_MOCK) {
    const cart = JSON.parse(localStorage.getItem("mock_cart") || "[]");
    if (cart.length === 0) throw new Error("Cart is empty");

    const orders = JSON.parse(localStorage.getItem("mock_orders") || "[]");
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = {
      id: Date.now(),
      status: "completed",
      total_price: totalPrice,
      created_at: new Date().toISOString(),
      items: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        price_at_purchase: item.price,
        image_url: item.image_url,
      })),
    };

    orders.unshift(order);
    localStorage.setItem("mock_orders", JSON.stringify(orders));
    localStorage.setItem("mock_cart", "[]");

    return { orderId: order.id };
  }

  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Checkout failed");
  return res.json();
};

export const getOrders = async () => {
  const token = localStorage.getItem("token");
  if (!token) return [];

  if (USE_MOCK) {
    return JSON.parse(localStorage.getItem("mock_orders") || "[]");
  }

  const res = await fetch(`${API_BASE}/orders`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};