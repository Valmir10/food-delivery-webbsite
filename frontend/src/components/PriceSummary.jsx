import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/PriceSummary.css";
import Alert from "./Alert.jsx";

const PriceSummary = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { cart } = useCartContext();

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [progress, setProgress] = useState(0);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const deliveryFee = cart.length > 0 ? 5 : 0;
  const total = subtotal + deliveryFee;

  const handleProceedToPayment = () => {
    if (!isLoggedIn) {
      setAlertMessage("Log in to continue");
      setShowAlert(true);
      setProgress(0);
      return;
    }
    if (cart.length === 0) {
      setAlertMessage("Your cart is empty");
      setShowAlert(true);
      setProgress(0);
      return;
    }
    navigate("/payment");
  };

  useEffect(() => {
    if (progress < 100 && showAlert) {
      const interval = setInterval(() => setProgress((p) => p + 1), 50);
      return () => clearInterval(interval);
    }
    if (progress >= 100) {
      setShowAlert(false);
      setProgress(0);
    }
  }, [progress, showAlert]);

  return (
    <div className="price-summary-container">
      <div className="promo-code-container">
        <div className="promo-code-content">
          <div className="promo-code-text-container">
            <p>If you have a promo code, Enter it here</p>
          </div>
          <label className="promo-code-input-container" htmlFor="promo-code-input">
            <input id="promo-code-input" placeholder="Promo Code" type="text" />
            <button className="submit-button">Submit</button>
          </label>
        </div>
      </div>

      <div className="price-content-container">
        <div className="price-content">
          <div className="cart-totals-p-container"><h1>Cart Totals</h1></div>
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
          onClose={() => { setShowAlert(false); setProgress(0); }}
        />
      )}
    </div>
  );
};

export default PriceSummary;