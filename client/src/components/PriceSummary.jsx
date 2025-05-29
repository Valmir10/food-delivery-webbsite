import React, { useState, useEffect, useMemo } from "react";
import { useOrder } from "./OrderContent.jsx";
import { useAuth } from "../hooks/useAuth.js";
import "../styles/PriceSummary.css";
import { useNavigate } from "react-router-dom";
import exclamationImage from "../images/exclamation.png";
import deleteIcon from "../images/cancel.png";
import Alert from "./Alert.jsx";

const PriceSummary = ({}) => {
  const navigate = useNavigate();
  const { state, dispatch } = useOrder();

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [progress, setProgress] = useState(0);
  const { isLoggedIn, isAuthChecked } = useAuth();

  const subtotal = useMemo(() => {
    return state.order.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [state.order]);

  const deliveryFee = useMemo(
    () => (state.order.length > 0 ? 5 : 0),
    [state.order]
  );

  const total = subtotal + deliveryFee;

  const handleProceedToPayment = () => {
    if (!isAuthChecked) {
      return;
    }

    const token = localStorage.getItem("token");
    const isUserLoggedIn = token !== null;

    if (!isUserLoggedIn) {
      setAlertMessage("You need to be logged in to proceed!");
      setShowAlert(true);
      setProgress(0);
      return;
    }

    if (state.order.length === 0) {
      setAlertMessage("No items in your order!");
      setShowAlert(true);
      setProgress(0);
      return;
    }

    navigate("/payment");
  };

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    setAlertMessage("Invalid promo code!");
    setShowAlert(true);
    setProgress(0);
  };

  useEffect(() => {
    if (progress < 100 && showAlert) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => prevProgress + 1);
      }, 50);
      return () => clearInterval(interval);
    } else if (progress === 100) {
      setShowAlert(false);
    }
  }, [progress, showAlert]);

  const handleDeleteAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="price-summary-container">
      <div className="promo-code-container">
        <div className="promo-code-content">
          <div className="promo-code-text-container">
            <p>If you have a promo code, Enter it here</p>
          </div>
          <label
            className="promo-code-input-container"
            htmlFor="promo-code-input"
          >
            <input id="promo-code-input" placeholder="Promo Code" type="text" />
            <button className="submit-button" onClick={handlePromoSubmit}>
              Submit
            </button>
          </label>
        </div>
      </div>

      <div className="price-content-container">
        <div className="price-content">
          <div className="cart-totals-p-container">
            <h1>Cart Totals</h1>
          </div>
          <div className="subtotal-p-container">
            <p>Subtotal</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
          <div className="delivery-fee-p-container">
            <p>Delivery Fee</p>
            <p>${deliveryFee.toFixed(2)}</p>
          </div>
          <div className="total-p-container">
            <p>Total</p>
            <p>${total.toFixed(2)}</p>
          </div>
          <div className="to-payment-button">
            <button onClick={handleProceedToPayment}>Proceed To Payment</button>
          </div>
        </div>
      </div>

      {showAlert && (
        <Alert
          message={alertMessage}
          progress={progress}
          onClose={() => {
            setShowAlert(false);
            setProgress(0);
          }}
        />
      )}
    </div>
  );
};

export default PriceSummary;
