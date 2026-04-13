//FoodSummary.jsx

import React, { useEffect, useState } from "react";
// import { useCart } from "../hooks/useCart";
import { useCartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/FoodSummary.css";
import exclamationImage from "../images/exclamation.png";
import deleteIcon from "../images/cancel.png";
import Alert from "./Alert.jsx";

const FoodSummary = () => {
  const { isLoggedIn } = useAuth();
  const { cart, add, update } = useCartContext();

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (cart.length === 0) {
      setAlertMessage("No items in your cart!");
      setShowAlert(true);
      setProgress(0);
    } else {
      setShowAlert(false);
    }
  }, [cart]);

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
    <div className="products-summary-container">
      <div className="product-content-container">
        <div className="product-text-summary-container">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        {cart.map((item) => (
          <div key={item.productId} className="product-items-summary-container">
            <div className="product-image-container">
              <img
                src={`http://localhost:3001${item.image_url}`}
                alt={item.name}
                onError={(e) => {
                  e.target.src = exclamationImage;
                }}
              />
            </div>

            <div>
              <p>{item.name}</p>
            </div>
            <div>
              <p>${item.price}</p>
            </div>
            <div>
              <p>{item.quantity}</p>
            </div>
            <div>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>

            <div
              className="delete-icon-container-2"
              onClick={() => update(item.productId, 0)}
            >
              <img src={deleteIcon} alt="Remove" />
            </div>
          </div>
        ))}
      </div>

      {showAlert && (
        <Alert
          message={alertMessage}
          progress={progress}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default FoodSummary;

/*
//FoodSummary.jsx

import React, { useState, useEffect } from "react";
import { useOrder } from "./OrderContent.jsx";
import "../styles/FoodSummary.css";
import exclamationImage from "../images/exclamation.png";
import deleteIcon from "../images/cancel.png";
import Alert from "./Alert.jsx";

const imageModules = import.meta.glob("../images/*", {
  eager: true,
  import: "default",
});
const productImageMap = Object.fromEntries(
  Object.entries(imageModules).map(([path, url]) => {
    const filename = path.split("/").pop();
    return [filename, url];
  })
);

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
                        : productImageMap[
                            item.imageUrl.replace(/^\/images\//, "")
                          ] || exclamationImage
                    }
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = exclamationImage;
                    }}
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

export default FoodSummary;


*/
