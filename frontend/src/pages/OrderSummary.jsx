import Header from "../components/Header";
import FoodSummary from "../components/FoodSummary";
import PriceSummary from "../components/PriceSummary";
import "../styles/OrderSummary.css";

const OrderSummary = () => {
  return (
    <div className="order-summary-container">
      <Header />
      <div className="order-summary-content">
        <FoodSummary />
        <PriceSummary />
      </div>
    </div>
  );
};

export default OrderSummary;