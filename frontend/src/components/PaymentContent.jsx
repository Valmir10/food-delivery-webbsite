import { useMemo, useState, useEffect } from "react";
import { useCartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { checkout } from "../services/ordersService";
import "../styles/PaymentContent.css";
import masterCardImage from "../images/mastercard.svg";
import visaCardImage from "../images/visa-card.svg";
import Alert from "./Alert.jsx";

const PaymentContent = () => {
  const { isLoggedIn } = useAuth();
  const { cart, clear } = useCartContext();
  const navigate = useNavigate();

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mmYyValue, setMmYyValue] = useState("");
  const [cardNumberValue, setCardNumberValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );
  const deliveryFee = cart.length > 0 ? 5 : 0;
  const total = subtotal + deliveryFee;

  const handleMmYyChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    setMmYyValue(value);
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.match(/.{1,4}/g)?.join("-").slice(0, 19) || "";
    setCardNumberValue(value);
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 10);
    if (value.length > 6) {
      value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
    } else if (value.length > 3) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    }
    setPhoneValue(value);
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

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    if (!isLoggedIn) {
      setAlertMessage("You must be logged in");
      setShowAlert(true);
      setProgress(0);
      setLoading(false);
      return;
    }

    if (cart.length === 0) {
      setAlertMessage("Your cart is empty");
      setShowAlert(true);
      setProgress(0);
      setLoading(false);
      return;
    }

    try {
      await checkout();
      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        clear();
        navigate("/completed");
      }, 2000);
    } catch (err) {
      setAlertMessage(err.message || "Payment failed");
      setShowAlert(true);
      setProgress(0);
      setLoading(false);
    }
  };

  return (
    <div className="payment-content-container">
      <div className="payment-input-information-container">
        <form className="payment-input-information" noValidate>
          <div className="pay-with-card-p-container"><p>Pay with card</p></div>

          <label className="phone-label-container" htmlFor="phone">
            <div className="input-header-text"><p>Phone number</p></div>
            <input id="phone" type="text" placeholder="123-123-1234" value={phoneValue} onChange={handlePhoneChange} maxLength="12" required />
          </label>

          <div className="city-zip-kode-container">
            <label className="city-label-container" htmlFor="city">
              <input id="city" type="text" placeholder="City" onInput={(e) => (e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ""))} required />
            </label>
            <label className="zip-kode-label-container" htmlFor="zip-kode">
              <input id="zip-kode" type="text" placeholder="Zip code" maxLength="5" onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))} required />
            </label>
          </div>

          <label className="card-number-label-container" htmlFor="card-number">
            <div className="input-header-text"><p>Card Number</p></div>
            <div className="input-wrapper">
              <div className="visacard-mastercard-container">
                <img className="visacard-image" src={visaCardImage} alt="Visa" />
                <img className="mastercard-image" src={masterCardImage} alt="MasterCard" />
              </div>
              <input id="card-number" type="text" placeholder="1234-1234-1234-1234" value={cardNumberValue} onChange={handleCardNumberChange} maxLength="19" required />
            </div>
          </label>

          <div className="mm-yy-cvc-container">
            <label className="mm-yy-label-container" htmlFor="mm-yy">
              <input id="mm-yy" type="text" placeholder="MM/YY" value={mmYyValue} onChange={handleMmYyChange} maxLength="5" required />
            </label>
            <label className="cvc-label-container" htmlFor="cvc">
              <input id="cvc" type="text" placeholder="CVC" maxLength="3" onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))} required />
            </label>
          </div>

          <label htmlFor="full-name" className="card-holder-label-container">
            <div className="input-header-text"><p>Cardholder</p></div>
            <input id="full-name" type="text" placeholder="Full name on card" onInput={(e) => (e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ""))} required />
          </label>

          <div className="pay-button-container-payment">
            <button type="submit" onClick={handlePayment}>Pay ${total.toFixed(2)}</button>
          </div>
        </form>
      </div>

      <div className="payment-products-summary-container">
        <div className="payment-products-summary">
          <div className="cart-summary-text-container"><h1>Cart Summary</h1></div>
          <div className="menu-items-summary-container">
            {cart.map((item) => (
              <div className="menu-items-summary" key={item.productId}>
                <div className="item-name-price-container">
                  <div className="item-name-container"><p>{item.name}</p></div>
                  <div className="item-price-container"><p>${(item.price * item.quantity).toFixed(2)}</p></div>
                </div>
                <div className="quantity-text-container">
                  <div className="quantity-amount-container"><p>Qty: {item.quantity}</p></div>
                  <div className="quantity-text-2"><p>${item.price.toFixed(2)} each</p></div>
                </div>
              </div>
            ))}
          </div>
          <div className="payment-totals">
            <div className="payment-subtotal"><p>Subtotal</p><p>${subtotal.toFixed(2)}</p></div>
            <div className="payment-delivery"><p>Delivery</p><p>${deliveryFee.toFixed(2)}</p></div>
            <div className="total-price-container"><p>Total</p><p>${total.toFixed(2)}</p></div>
          </div>
        </div>
      </div>

      <div className={`loading-overlay ${loading || success ? "active" : ""}`}>
        {loading ? (
          <div className="loader"></div>
        ) : success ? (
          <div className="checkmark-container">
            <div className="checkmark-circle">
              <div className="checkmark">&#10003;</div>
            </div>
          </div>
        ) : null}
      </div>

      {showAlert && (
        <Alert message={alertMessage} progress={progress} onClose={() => { setShowAlert(false); setProgress(0); }} />
      )}
    </div>
  );
};

export default PaymentContent;