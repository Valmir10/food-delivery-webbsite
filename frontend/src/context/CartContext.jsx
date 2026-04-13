import { createContext, useContext } from "react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const cartState = useCart(isLoggedIn);

  return (
    <CartContext.Provider value={cartState}>{children}</CartContext.Provider>
  );
};

export const useCartContext = () => {
  return useContext(CartContext);
};
