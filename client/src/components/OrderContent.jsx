//OrderContent.jsx

import React, { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth"; // get information about user log in from useAuth

// Initial state
const initialState = {
  order: JSON.parse(localStorage.getItem("cart")) || [],
  quantities: JSON.parse(localStorage.getItem("quantities")) || {},
  showCartTooltip:
    JSON.parse(localStorage.getItem("cart"))?.some(
      (item) => item.quantity > 0
    ) || false,
};

// Reducer-function
const orderReducer = (state, action) => {
  switch (action.type) {
    case "SET_ORDER":
      const hasItems = action.payload.some((item) => item.quantity > 0);
      localStorage.setItem("showCartTooltip", JSON.stringify(hasItems));
      return {
        ...state,
        order: action.payload,
        showCartTooltip: hasItems,
      };

    case "ADD_TO_ORDER":
      if (!action.payload || !action.payload._id) {
        console.error(
          "Invalid payload received in ADD_TO_ORDER:",
          action.payload
        );
        return state;
      }

      const existingItem = state.order.find(
        (item) => item._id === action.payload._id
      );
      const updatedOrder = existingItem
        ? state.order.map((item) =>
            item._id === action.payload._id
              ? { ...item, quantity: action.payload.quantity }
              : item
          )
        : [
            ...state.order,
            { ...action.payload, quantity: action.payload.quantity || 1 },
          ];

      const newQuantities = {
        ...state.quantities,
        [action.payload._id]: action.payload.quantity || 1,
      };

      localStorage.setItem("cart", JSON.stringify(updatedOrder));
      localStorage.setItem("quantities", JSON.stringify(newQuantities));

      return {
        ...state,
        order: updatedOrder,
        quantities: newQuantities,
        showCartTooltip: updatedOrder.some((item) => item.quantity > 0),
      };

    case "UPDATE_QUANTITY":
      if (!action.payload || !action.payload._id) {
        return state;
      }

      const updatedQuantities = {
        ...state.quantities,
        [action.payload._id]: action.payload.quantity,
      };

      localStorage.setItem("quantities", JSON.stringify(updatedQuantities));
      return { ...state, quantities: updatedQuantities };

    case "REMOVE_FROM_ORDER":
      const filteredOrder = state.order.filter(
        (item) => item._id !== action.payload
      );
      const { [action.payload]: _, ...filteredQuantities } = state.quantities;

      localStorage.setItem("cart", JSON.stringify(filteredOrder));
      localStorage.setItem("quantities", JSON.stringify(filteredQuantities));

      return {
        ...state,
        order: filteredOrder,
        quantities: filteredQuantities,
        showCartTooltip: filteredOrder.some((item) => item.quantity > 0),
      };

    case "RESET_ORDER":
      localStorage.removeItem("cart");
      localStorage.removeItem("quantities");
      return { ...state, order: [], quantities: {}, showCartTooltip: false };

    case "CLEAR_ORDER":
      console.log("Clearing order after successful payment");
      localStorage.removeItem("cart");
      localStorage.removeItem("quantities");
      return { ...state, order: [], quantities: {}, showCartTooltip: false };

    case "SHOW_CART_TOOLTIP":
      localStorage.setItem("showCartTooltip", JSON.stringify(true));
      return { ...state, showCartTooltip: true };

    case "SHOW_GUEST_TOOLTIP":
      console.log("🔹 SHOW_GUEST_TOOLTIP körs! Tooltipen borde synas.");
      return {
        ...state,
        showCartTooltip: true,
        quantities: { ...state.quantities },
      };

    case "HIDE_CART_TOOLTIP":
      localStorage.setItem("showCartTooltip", JSON.stringify(false));
      return { ...state, showCartTooltip: false };

    case "PERSIST_QUANTITIES":
      return { ...state, quantities: { ...state.quantities } };

    default:
      console.log("Unknown action type:", action.type);
      return state;
  }
};

// Context-skapande
const OrderContext = createContext();

// Provider-komponent

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const syncCartWithBackend = async () => {
      const token = localStorage.getItem("token");
      if (!token || !isLoggedIn) return;

      try {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        const response = await axios.get("http://localhost:5001/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const backendCart = response.data || [];

        // Slå ihop localStorage-cart och backend-cart
        const mergedCart = [...backendCart];
        localCart.forEach((item) => {
          const existingItem = mergedCart.find(
            (prod) => prod.productId === item._id
          );
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            mergedCart.push({ productId: item._id, quantity: item.quantity });
          }
        });

        // send the cart content to backend
        await axios.put(
          "http://localhost:5001/api/cart",
          { cart: mergedCart },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        localStorage.setItem("cart", JSON.stringify(mergedCart));
        dispatch({ type: "SET_ORDER", payload: mergedCart });
      } catch (error) {}
    };

    syncCartWithBackend();
  }, [isLoggedIn]);

  const updateCart = async (newCart) => {
    const token = localStorage.getItem("token");
    if (!token || !isLoggedIn) return;

    try {
      await axios.put(
        "http://localhost:5001/api/cart",
        { cart: newCart },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch({ type: "SET_ORDER", payload: newCart });

      localStorage.setItem("cart", JSON.stringify(newCart));
    } catch (error) {
      console.error("Failed to update cart:", error);
    }
  };

  // get cart when logged in

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token || !isLoggedIn) return;

      try {
        const response = await axios.get("http://localhost:5001/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const cartData = response.data;

        dispatch({ type: "SET_ORDER", payload: cartData });

        localStorage.setItem("cart", JSON.stringify(cartData));
      } catch (error) {}
    };

    fetchCart(); // 🔹 Körs direkt efter inloggning
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch({ type: "PERSIST_QUANTITIES" });
    }
  }, [isLoggedIn]);

  return (
    <OrderContext.Provider value={{ state, dispatch, updateCart }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
