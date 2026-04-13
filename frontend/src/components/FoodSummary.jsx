import { useEffect, useState } from "react";
import { useCartContext } from "../context/CartContext";
import { API_BASE, USE_MOCK } from "../config/api";
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
  }),
);

const FoodSummary = () => {
  const { cart, update } = useCartContext();
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

  const getImageSrc = (item) => {
    if (USE_MOCK) {
      const filename = item.image_url?.replace("/images/", "");
      return productImageMap[filename] || exclamationImage;
    }
    return `${API_BASE}${item.image_url}`;
  };

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
                src={getImageSrc(item)}
                alt={item.name}
                onError={(e) => { e.target.src = exclamationImage; }}
              />
            </div>
            <div><p>{item.name}</p></div>
            <div><p>${item.price}</p></div>
            <div><p>{item.quantity}</p></div>
            <div><p>${(item.price * item.quantity).toFixed(2)}</p></div>
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