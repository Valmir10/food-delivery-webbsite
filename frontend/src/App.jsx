import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import OrderSummary from "./pages/OrderSummary";
import PaymentInformation from "./pages/PaymentInformation";
import OrderCompleted from "./pages/OrderCompleted";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/summary" element={<OrderSummary />} />
      <Route path="/payment" element={<PaymentInformation />} />
      <Route path="/completed" element={<OrderCompleted />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;