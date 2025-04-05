import React, { useMemo, useState } from "react";
import { useOrder } from "./OrderContent.jsx";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./PaymentContent.css";
import masterCardImage from "../images/mastercard.svg";
import visaCardImage from "../images/visa-card.svg";
import exclamationImage from "../images/exclamation.png";
import deleteIcon from "../images/cancel.png";

const PaymentContent = () => {
  const { state, dispatch } = useOrder();
  const navigate = useNavigate();

  const { isLoggedIn, isAuthChecked } = useAuth();
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [progress, setProgress] = useState(0);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mmYyValue, setMmYyValue] = useState("");
  const [cardNumberValue, setCardNumberValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");

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

  const handleMmYyChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setMmYyValue(value);
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value
      .match(/.{1,4}/g)
      ?.join("-")
      .slice(0, 19);
    setCardNumberValue(value);
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 10);

    if (value.length > 3 && value.length <= 6) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 6 && value.length <= 8) {
      value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
    } else if (value.length > 8) {
      value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(
        6,
        8
      )}-${value.slice(8)}`;
    }

    setPhoneValue(value);
  };
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    if (!isAuthChecked) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const isUserLoggedIn = token !== null;

    if (!isUserLoggedIn) {
      setAlertMessage("You need to be logged in to proceed with payment!");
      setShowAlert(true);
      setProgress(0);
      setLoading(false);
      return;
    }

    if (state.order.length === 0) {
      setAlertMessage("Your cart is empty. Add items before proceeding!");
      setShowAlert(true);
      setProgress(0);
      setLoading(false);
      return;
    }

    try {
      let response = await fetch("http://localhost:5001/api/orders", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok && data.activeOrder) {
        const activeOrderId = data.activeOrder._id;

        await fetch(`http://localhost:5001/api/orders/${activeOrderId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderStatus: "completed" }),
        });
      }

      const orderData = {
        products: state.order.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice: total,
      };

      response = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setTimeout(() => {
          setLoading(false);
          setSuccess(true);

          setTimeout(() => {
            dispatch({ type: "RESET_ORDER" });
            setSuccess(false);
            navigate("/order-completed");
          }, 2000);
        }, 3000);
      } else {
        const errorData = await response.json();
        console.error("❌ Order placement failed:", errorData);
        setLoading(false);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setLoading(false);
    }
  };

  const handleDeleteAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="payment-content-container">
      <div className="payment-input-information-container">
        <form className="payment-input-information" noValidate>
          <div className="pay-with-card-p-container">
            <p>Pay with card</p>
          </div>

          <label className="phone-label-container" htmlFor="phone">
            <div className="input-header-text">
              <p>Phone number</p>
            </div>
            <input
              id="phone"
              type="text"
              placeholder="123-123-12-12"
              value={phoneValue}
              onChange={handlePhoneChange}
              maxLength="13"
              required
            />
          </label>
          <div className="city-zip-kode-container">
            <label className="city-label-container" htmlFor="city">
              <input
                id="city"
                type="text"
                placeholder="City"
                onInput={(e) =>
                  (e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ""))
                }
                required
              />
            </label>

            <label className="zip-kode-label-container" htmlFor="zip-kode">
              <input
                id="zip-kode"
                type="text"
                placeholder="Zip kode"
                pattern="\d{5}"
                maxLength="5"
                onInput={(e) =>
                  (e.target.value = e.target.value.replace(/\D/g, ""))
                }
                required
              />
            </label>
          </div>

          <label className="card-number-label-container" htmlFor="card-number">
            <div className="input-header-text">
              <p>Card Number</p>
            </div>
            <div className="input-wrapper">
              <div className="visacard-mastercard-container">
                <div className="visacard-image-container">
                  <img
                    className="visacard-image"
                    src={visaCardImage}
                    alt="Visa"
                  />
                </div>
                <div className="mastercard-image-container">
                  <img
                    className="mastercard-image"
                    src={masterCardImage}
                    alt="MasterCard"
                  />
                </div>
              </div>

              <input
                id="card-number"
                type="text"
                placeholder="1234-1234-1234-1234"
                value={cardNumberValue}
                onChange={handleCardNumberChange}
                maxLength="19"
                required
              />
            </div>
          </label>

          <div className="mm-yy-cvc-container">
            <label className="mm-yy-label-container" htmlFor="mm-yy">
              <input
                id="mm-yy"
                type="text"
                placeholder="MM/YY"
                value={mmYyValue}
                onChange={handleMmYyChange}
                maxLength="5"
                required
              />
            </label>

            <label className="cvc-label-container" htmlFor="cvc">
              <input
                id="cvc"
                type="text"
                placeholder="CVC"
                pattern="\d{3}"
                maxLength="3"
                onInput={(e) =>
                  (e.target.value = e.target.value.replace(/\D/g, ""))
                }
                required
              />
            </label>
          </div>

          <label htmlFor="full-name" className="card-holder-label-container">
            <div className="input-header-text">
              <p>Cardholder</p>
            </div>
            <input
              id="full-name"
              type="text"
              placeholder="Full name on card"
              onInput={(e) =>
                (e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ""))
              }
              required
            />
          </label>

          <div className="pay-button-container-payment">
            <button type="submit" onClick={handlePayment}>
              Pay
            </button>
          </div>
        </form>
      </div>

      <div className="payment-products-summary-container">
        <div className="payment-products-summary">
          <div className="cart-summary-text-container">
            <h1>Cart Summary</h1>
          </div>

          <div className="menu-items-summary-container">
            {state.order.map((item) => (
              <div className="menu-items-summary" key={item._id}>
                <div className="item-name-price-container">
                  <div className="item-name-container">
                    <p>{item.name}</p>
                  </div>
                  <div className="item-price-container">
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
                <div className="quantity-text-container">
                  <div className="quantity-amount-container">
                    <p>Quantity {item.quantity}</p>
                  </div>
                  <div className="quantity-text-2">
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="total-price-container">
            <p>Total cost: ${total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className={`loading-overlay ${loading || success ? "active" : ""}`}>
        {loading ? (
          <div className="loader"></div>
        ) : success ? (
          <div className="checkmark-container">
            <div className="checkmark-circle">
              <div className="checkmark">✓</div>
            </div>
          </div>
        ) : null}
      </div>

      {showAlert && (
        <div className="alert-container">
          <div className="alert-content-container">
            <div className="alert-image-container">
              <img src={exclamationImage} alt="Exclamation" />
            </div>
            <div className="alert-message-container">
              <p>{alertMessage}</p>
            </div>
            <img
              className="delete-icon-alert"
              src={deleteIcon}
              alt="Delete Alert"
              onClick={handleDeleteAlert}
            />
          </div>
          <div className="alert-loading-bar">
            <div
              className="alert-progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentContent;
