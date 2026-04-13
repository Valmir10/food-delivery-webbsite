//ContactUsForm.jsx
import React, { useState } from "react";
import deleteIcon from "../images/cancel.png";

export default function ContactUsForm({ onClose, onSend }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <form
      className="contact-us-form-container"
      onSubmit={(e) => {
        e.preventDefault();
        onSend({ name, email, message });
      }}
    >
      <div className="container-1-contact-us">
        <div className="contact-us-container-p">
          <p>Contact us</p>
        </div>
        <div className="delete-icon-container">
          <img
            className="delete-icon-img"
            src={deleteIcon}
            alt="Delete"
            onClick={onClose}
          />
        </div>
      </div>

      <div className="personal-information-container-contact">
        <label className="your-name-box-container" htmlFor="your-name-box">
          <input
            id="your-name-box"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="your-email-box-container" htmlFor="your-email-box">
          <input
            id="your-email-box"
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
      </div>

      <div className="your-message-container">
        <label
          className="your-message-label-container"
          htmlFor="your-message-box"
        >
          <textarea
            id="your-message-box"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>
      </div>

      <div id="send-message-contact-us" className="container-3-create-button">
        <button type="submit">Send</button>
      </div>
    </form>
  );
}
