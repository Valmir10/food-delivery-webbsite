import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";
import { OrderProvider } from "./components/OrderContent.jsx";
console.log("🚀 import.meta.env:", import.meta.env);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/food-delivery-webbsite/">
      <OrderProvider>
        <App />
      </OrderProvider>
    </BrowserRouter>
  </StrictMode>
);
