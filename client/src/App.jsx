// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import DeliveryInformation from "./pages/DeliveryInformation";
import OrderSummary from "./pages/OrderSummary";
import PaymentInformation from "./pages/PaymentInformation";
import OrderCompleted from "./pages/OrderCompleted";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/delivery" element={<DeliveryInformation />} />

      <Route path="/summary" element={<OrderSummary />} />

      <Route path="/payment" element={<PaymentInformation />} />

      <Route path="/completed" element={<OrderCompleted />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

/*

import "./App.css";

import DeliveryInformation from "./pages/DeliveryInformation";
import HomePage from "./pages/HomePage";
import OrderCompleted from "./pages/OrderCompleted";
import OrderSummary from "./pages/OrderSummary";
import "./pages/PaymentInformation";
import PaymentInformation from "./pages/PaymentInformation";

function App() {
  return (
    <div className="website-app-container">
      <DeliveryInformation />
      <HomePage />
      <OrderCompleted />
      <OrderSummary />
      <PaymentInformation />
    </div>
  );
}

export default App;


*/
