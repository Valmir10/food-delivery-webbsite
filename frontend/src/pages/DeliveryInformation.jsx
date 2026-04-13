import React from "react";
import "../styles/DeliveryInformation.css";
import Header from "../components/Header";
import PersonalInformation from "../components/PersonalInformation";

const DeliveryInformation = () => {
  return (
    <div className="delivery-information-container">
      <Header />
      <PersonalInformation />
    </div>
  );
};

export default DeliveryInformation;
