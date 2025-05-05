// DeliveryDetails.jsx

import React, { useState, useEffect } from "react";
import "./DeliveryDetails.css";
import cardBoardBox from "../images/cardboard-box.png";
import { useOrder } from "../components/OrderContent";

const DeliveryDetails = () => {
  const { state } = useOrder();
  const [showMyOrderDetails, setShowMyOrderDetails] = useState(false);
  const [showPreviousOrderDetails, setShowPreviousOrderDetails] =
    useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [previousOrder, setPreviousOrder] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const deliveryFee = 5;

  // Get orders from server
  const fetchOrders = async () => {
    try {
      let token = localStorage.getItem("token");

      let response = await fetch("http://localhost:5001/api/orders", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        const data = await response.json();
        if (data.newToken) {
          console.log(" Förnyar token...");
          localStorage.setItem("token", data.newToken);
          token = data.newToken;

          response = await fetch("http://localhost:5001/api/orders", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        }
      }

      if (response.ok) {
        const { activeOrder, completedOrders } = await response.json();
        setActiveOrder(activeOrder || null);
        setPreviousOrder(
          completedOrders?.length > 0 ? completedOrders[0] : null
        );

        if (activeOrder) {
          const expiresAt = new Date(activeOrder.expiresAt).getTime();
          const now = new Date().getTime();
          const remainingTime = Math.max(
            0,
            Math.floor((expiresAt - now) / 1000)
          );
          setTimeLeft(remainingTime > 0 ? remainingTime : 600);
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const completeOrder = async () => {
    if (!activeOrder) return;

    try {
      let token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5001/api/orders/${activeOrder._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderStatus: "completed" }),
        }
      );

      if (response.ok) {
        console.log(" Order marked as completed!");

        // Copy My Order to Previous Order
        setPreviousOrder({
          ...activeOrder,
          orderStatus: "completed",
        });

        // delete my order
        setActiveOrder(null);
        setTimeLeft(null);
      } else {
        console.error(" Failed to update order.");
      }
    } catch (error) {
      console.error(" Network error:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (timeLeft === null) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) return prev - 1;
        completeOrder();
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const calculateTotalPrice = (order, includeFee = false) => {
    if (!order) return 0;
    const total = order.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return includeFee ? total + deliveryFee : total;
  };

  const generateProductLayout = (products) => {
    const isSmallScreen = window.innerWidth <= 480 && window.innerHeight <= 850;

    if (isSmallScreen) {
      // Group products by category and sum quantities
      const groupedProducts = products.reduce((acc, product) => {
        const category = product.productId.category;
        if (!acc[category]) {
          acc[category] = { category: category, quantity: 0 };
        }
        acc[category].quantity += product.quantity;
        return acc;
      }, {});

      const groupedArray = Object.values(groupedProducts);

      const rows = [
        groupedArray.slice(0, 5),
        groupedArray.slice(5, 10),
        groupedArray.slice(10, 15),
        groupedArray.slice(15, 20),
        groupedArray.slice(20, 26),
        groupedArray.slice(26, 32),
      ];

      return rows.map((row, rowIndex) => (
        <div key={rowIndex} className={`row-${rowIndex + 1}-container`}>
          {row.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className={`row-${rowIndex + 1}-column-${
                groupIndex + 1
              }-container`}
            >
              <p>
                {group.category} x {group.quantity}
              </p>
            </div>
          ))}
        </div>
      ));
    } else {
      const rows = [
        products.slice(0, 5),
        products.slice(5, 10),
        products.slice(10, 15),
        products.slice(15, 20),
        products.slice(20, 26),
        products.slice(26, 32),
      ];

      return rows.map((row, rowIndex) => (
        <div key={rowIndex} className={`row-${rowIndex + 1}-container`}>
          {row.map((product, productIndex) => (
            <div
              key={productIndex}
              className={`row-${rowIndex + 1}-column-${
                productIndex + 1
              }-container`}
            >
              <p>
                {product.name} X {product.quantity}
              </p>
            </div>
          ))}
        </div>
      ));
    }
  };
  return (
    <div className="delivery-details-content-container">
      <div className="my-order-container">
        <div className="my-order-content" id="my-order-content">
          <div className="my-order-text-container">
            <h2>My Order</h2>
          </div>
          {activeOrder && (
            <div
              className={`my-order-information-container ${
                showMyOrderDetails ? "active-border-bottom" : ""
              }`}
            >
              <div
                className={`my-order-information ${
                  showMyOrderDetails ? "active-border" : ""
                }`}
              >
                <div className="cardboard-box-image">
                  <img src={cardBoardBox} alt="Cardboard Box" />
                </div>

                <div className="food-processing-text-container">
                  <div className="food-text-content">
                    <p>Processing</p>
                  </div>

                  <div className="food-text-tooltip-container">
                    <div className="food-processing-tooltip"></div>
                  </div>
                </div>

                <div className="price-order-text">
                  <p>${calculateTotalPrice(activeOrder, true).toFixed(2)}</p>
                </div>
                <div className="items-order-text">
                  <p>
                    Items:{" "}
                    {activeOrder.products.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}
                  </p>
                </div>
                <div className="timer-container">
                  <p>{formatTime(timeLeft)}</p>
                </div>
                <div className="more-button-container">
                  <button
                    onClick={() => setShowMyOrderDetails(!showMyOrderDetails)}
                  >
                    {showMyOrderDetails ? "Close" : "More"}
                  </button>
                </div>
              </div>
              {showMyOrderDetails && (
                <div className="food-information-container">
                  {generateProductLayout(activeOrder.products)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="previous-order-container">
        <div className="previous-order-content">
          <div className="previous-order-text-container">
            <h2>Previous Order</h2>
          </div>
          {previousOrder && (
            <div
              className={`previous-order-information-container ${
                showPreviousOrderDetails ? "active-border-bottom" : ""
              }`}
            >
              <div
                className={`previous-order-information ${
                  showPreviousOrderDetails ? "active-border" : ""
                }`}
              >
                <div className="cardboard-box-image">
                  <img src={cardBoardBox} alt="Cardboard Box" />
                </div>

                <div className="food-processing-text-container">
                  <div className="food-text-content">
                    <p>Delivered</p>
                  </div>

                  <div className="food-text-tooltip-container">
                    <div className="food-delivered-tooltip"></div>
                  </div>
                </div>

                <div className="price-order-text">
                  <p>${calculateTotalPrice(previousOrder, true).toFixed(2)}</p>
                </div>
                <div className="items-order-text">
                  <p>
                    Items:{" "}
                    {previousOrder.products.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}
                  </p>
                </div>
                <div className="timer-container">
                  <p>00:00</p>
                </div>
                <div className="more-button-container">
                  <button
                    onClick={() =>
                      setShowPreviousOrderDetails(!showPreviousOrderDetails)
                    }
                  >
                    {showPreviousOrderDetails ? "Close" : "More"}
                  </button>
                </div>
              </div>
              {showPreviousOrderDetails && (
                <div className="food-information-container">
                  {generateProductLayout(previousOrder.products)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;
