//App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import OrderSummary from "./OrderSummary";
import DeliveryInformation from "./DeliveryInformation";
import PaymentInformation from "./PaymentInformation";
import OrderCompleted from "./OrderCompleted";
import { OrderProvider } from "./components/OrderContent.jsx";

const App = () => {
  return (
    <OrderProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/order-summary" element={<OrderSummary />} />
            <Route
              path="/delivery-information"
              element={<DeliveryInformation />}
            />
            <Route
              path="/payment-information"
              element={<PaymentInformation />}
            />
            <Route path="/order-completed" element={<OrderCompleted />} />
          </Routes>
        </div>
      </Router>
    </OrderProvider>
  );
};

export default App;
