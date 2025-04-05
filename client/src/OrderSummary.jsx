//OrderSummary.jsx
import React from "react";
import "./OrderSummary.css";
import Header from "./components/Header";
import FoodSummary from "./components/FoodSummary";
import PriceSummary from "./components/PriceSummary";
import { useOrder } from "./components/OrderContent.jsx";

const OrderSummary = () => {
  const { state, dispatch } = useOrder();

  const handleRemoveItem = (id) => {
    dispatch({ type: "REMOVE_FROM_ORDER", payload: id });
  };

  return (
    <div className="order-summary-container">
      <Header />

      <FoodSummary order={state.order} onRemoveItem={handleRemoveItem} />

      <PriceSummary order={state.order} />
    </div>
  );
};

export default OrderSummary;
