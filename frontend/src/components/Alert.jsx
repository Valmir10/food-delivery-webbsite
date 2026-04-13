//Alert.jsx
import React from "react";
import exclamationImage from "../images/exclamation.png";
import deleteIcon from "../images/cancel.png";

export default function Alert({ message, progress, onClose }) {
  return (
    <div className="alert-container">
      <div className="alert-content-container">
        <div className="alert-image-container">
          <img src={exclamationImage} alt="Exclamation" />
        </div>
        <div className="alert-message-container">
          <p>{message}</p>
        </div>
        <img
          className="delete-icon-alert"
          src={deleteIcon}
          alt="Delete Alert"
          onClick={onClose}
          style={{ cursor: "pointer" }}
        />
      </div>
      <div className="alert-loading-bar">
        <div className="alert-progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
