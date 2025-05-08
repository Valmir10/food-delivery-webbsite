//FoodSummary.jsx

import React, { useState, useEffect } from "react";
import { useOrder } from "./OrderContent.jsx";
import "../styles/FoodSummary.css";
import exclamationImage from "../images/exclamation.png";
import deleteIcon from "../images/cancel.png";

const FoodSummary = ({ onRemoveItem }) => {
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [progress, setProgress] = useState(0);
  const { state } = useOrder();

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

  useEffect(() => {
    if (state.order.length === 0) {
      setAlertMessage("No items in your order!");
      setShowAlert(true);
      setProgress(0);
    } else {
      setShowAlert(false);
    }
  }, [state.order]);

  return (
    <div className="products-summary-container">
      <div className="product-content-container">
        <div className="product-text-summary-container">
          <div className="items-text">
            <p>Items</p>
          </div>
          <div className="title-text">
            <p>Title</p>
          </div>
          <div className="price-text">
            <p>Price</p>
          </div>
          <div className="quantity-text">
            <p>Quantity</p>
          </div>
          <div className="total-text">
            <p>Total</p>
          </div>
          <div className="remove-text">
            <p>Remove</p>
          </div>
        </div>

        {state.order.length > 0
          ? state.order.map((item) => (
              <div className="product-items-summary-container" key={item._id}>
                <div className="product-image-container">
                  <img
                    src={
                      item.imageUrl?.startsWith("http")
                        ? item.imageUrl
                        : item.imageUrl
                        ? require(`../images${item.imageUrl.replace(
                            "/images",
                            ""
                          )}`)
                        : exclamationImage
                    }
                    alt={item.name}
                  />
                </div>
                <div className="product-title-container">
                  <p>{item.name}</p>
                </div>
                <div className="product-price-container">
                  <p>${item.price}</p>
                </div>
                <div className="product-quantity-container">
                  <p>{item.quantity}</p>
                </div>
                <div className="product-total-container">
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div
                  className="delete-icon-container-2"
                  onClick={() => onRemoveItem(item._id)}
                >
                  <img src={deleteIcon} alt="Remove" />
                </div>
              </div>
            ))
          : null}
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

export default FoodSummary;
