import { useEffect, useState } from "react";
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart as clearCartService,
} from "../services/cartService";

export const useCart = (isLoggedIn) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    if (!isLoggedIn) {
      setCart([]);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchCart();
      setCart(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [isLoggedIn]);

  const add = async (productId) => {
    await addToCart(productId, 1);
    await loadCart();
  };

  const update = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateCartItem(productId, quantity);
    }
    await loadCart();
  };

  const clear = async () => {
    await clearCartService();
    setCart([]);
  };

  return {
    cart,
    loading,
    add,
    update,
    clear,
    reload: loadCart,
  };
};