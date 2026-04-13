import { useState, useEffect } from "react";
import "../styles/DeliveryDetails.css";
import cardBoardBox from "../images/cardboard-box.png";
import { getOrders } from "../services/ordersService";

const DeliveryDetails = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOrders();
        setOrders(data.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="delivery-details-content-container">
        <p className="delivery-loading">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="delivery-details-content-container">
      <div className="order-confirmed-banner">
        <div className="checkmark-icon">&#10003;</div>
        <h2>Order Confirmed!</h2>
        <p>Your food is being prepared and will be delivered shortly.</p>
      </div>

      {orders.length > 0 && (
        <div className="recent-orders-section">
          <h3>Your Recent Orders</h3>
          {orders.map((order) => (
            <div key={order.id} className="order-detail-card">
              <div
                className="order-detail-header"
                onClick={() =>
                  setExpandedOrder(expandedOrder === order.id ? null : order.id)
                }
              >
                <div className="order-detail-icon">
                  <img src={cardBoardBox} alt="Order" />
                </div>
                <div className="order-detail-info">
                  <span className={`order-badge ${order.status}`}>
                    {order.status === "active" ? "Processing" : "Delivered"}
                  </span>
                  <span className="order-detail-price">
                    ${(order.total_price + 5).toFixed(2)}
                  </span>
                </div>
                <button className="order-detail-toggle">
                  {expandedOrder === order.id ? "Close" : "Details"}
                </button>
              </div>

              {expandedOrder === order.id && order.items && (
                <div className="order-detail-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-detail-item">
                      <span>{item.name}</span>
                      <span>x{item.quantity}</span>
                      <span>${(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryDetails;