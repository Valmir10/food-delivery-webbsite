import React from "react";
import "../styles/PersonalInformation.css";
import { useNavigate } from "react-router-dom";

const PersonalInformation = () => {
  const navigate = useNavigate();

  const handleProceedToPayment = () => {
    navigate("/payment-information");
  };

  return (
    <div className="delivery-information-content-container">
      <div className="personal-information-container">
        <form className="personal-information-content-container">
          <div className="first-last-name-container">
            <label className="first-name-container" htmlFor="first-name">
              <input
                placeholder="First Name"
                required
                type="text"
                id="first-name"
              ></input>
            </label>

            <label className="last-name-container" htmlFor="last-name">
              <input
                placeholder="Last Name"
                required
                type="text"
                id="last-name"
              ></input>
            </label>
          </div>

          <div className="email-adress-container">
            <label className="email-adress-content-container" htmlFor="email">
              <input
                placeholder="Email"
                required
                type="text"
                id="email"
              ></input>
            </label>
          </div>

          <div className="country-container">
            <label className="country-content-container" htmlFor="country">
              <input
                placeholder="Country"
                required
                type="text"
                id="country"
              ></input>
            </label>
          </div>

          <div className="city-zip-kode-container">
            <label className="city-container" htmlFor="city">
              <input placeholder="City" required type="text" id="city"></input>
            </label>

            <label className="zip-kode-container" htmlFor="zip-kode">
              <input
                placeholder="Zip Code"
                required
                type="text"
                id="zip-kode"
              ></input>
            </label>
          </div>
          <div className="phone-container">
            <label className="phone-content-container" htmlFor="phone">
              <input
                placeholder="Phone"
                required
                type="text"
                id="phone"
              ></input>
            </label>
          </div>
        </form>
      </div>

      <div className="price-information-container">
        <div className="price-content-container-2">
          <div className="price-content-2">
            <div className="cart-totals-p-container-2">
              <h1>Cart Totals</h1>
            </div>
            <div className="subtotal-p-container-2">
              <p>Subtotal</p>
              <p>$14</p>
            </div>
            <div className="delivery-fee-p-container-2">
              <p>Delivery Fee</p>
              <p>$5</p>
            </div>
            <div className="total-p-container-2">
              <p>Total</p>
              <p>$19</p>
            </div>
            <div className="to-payment-button-2">
              <button onClick={handleProceedToPayment}>
                Proceed To Payment
              </button>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
