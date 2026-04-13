import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrders } from "../services/ordersService";
import Header from "../components/Header";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data.slice(0, 10));
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!isLoggedIn) return null;

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <h2 className="profile-name">{user?.name || "User"}</h2>
          <p className="profile-email">{user?.email || ""}</p>
          <button className="profile-logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>

        <div className="orders-section">
          <h2 className="orders-title">Recent Orders</h2>
          {loading ? (
            <p className="orders-loading">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="no-orders">
              <p>No orders yet</p>
              <button onClick={() => navigate("/")}>Browse Menu</button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-card-header">
                    <span className="order-id">Order #{order.id}</span>
                    <span className={`order-status ${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-card-items">
                    {order.items?.map((item, i) => (
                      <span key={i} className="order-item-tag">
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                  </div>
                  <div className="order-card-footer">
                    <span className="order-date">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    <span className="order-total">
                      ${(order.total_price + 5).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;