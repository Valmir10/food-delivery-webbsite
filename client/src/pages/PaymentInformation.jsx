import React from "react";
import "../styles/PaymentInformation.css";
import Header from "../components/Header";
import PaymentContent from "../components/PaymentContent";

const PaymentInformation = () => {
  return (
    <div className="payment-information-container">
      <Header />
      <PaymentContent />
    </div>
  );
};

export default PaymentInformation;
