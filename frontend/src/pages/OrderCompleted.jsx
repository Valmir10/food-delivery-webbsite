import Header from "../components/Header";
import DeliveryDetails from "../components/DeliveryDetails";
import "../styles/OrderCompleted.css";

const OrderCompleted = () => {
  return (
    <div className="order-completed-container">
      <Header />
      <DeliveryDetails />
    </div>
  );
};

export default OrderCompleted;