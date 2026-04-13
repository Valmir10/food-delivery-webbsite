import React from "react";
import "../styles/OrderCompleted.css";
import Header from "../components/Header";
import DeliveryDetails from "../components/DeliveryDetails";

const OrderCompleted = () => {
  return (
    <div className="order-completed-container">
      <Header />
      <DeliveryDetails />
    </div>
  );
};

export default OrderCompleted;
