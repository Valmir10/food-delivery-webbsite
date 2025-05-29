//AuthForms.jsx

import React, { useState } from "react";
import deleteIcon from "../images/cancel.png";

export function SignInForm({ onLogin, onClose, switchToSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <form className="sign-in-form" onSubmit={handleSubmit}>
      <div className="container-1-sing-in">
        <div className="sign-in-container">
          <p>Sign In</p>
        </div>
        <div className="delete-icon-container">
          <img
            className="delete-icon-img"
            src={deleteIcon}
            alt="Close"
            onClick={onClose}
          />
        </div>
      </div>

      <div className="container-2-personal-information-sign-in">
        <label htmlFor="sign-in-email" className="sign-in-emai-label">
          <input
            id="sign-in-email"
            className="your-email-box"
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label htmlFor="sign-in-password" className="sign-in-password-label">
          <input
            id="sign-in-password"
            className="your-password-box"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
      </div>

      <div className="container-3-create-button">
        <button type="submit">Login</button>
      </div>

      <div className="container-4-create-account">
        <p className="create-account-p">Create a new account?</p>
        <p className="click-here-p" onClick={switchToSignUp}>
          Click here
        </p>
      </div>
    </form>
  );
}

export function SignUpForm({ onSignUp, onClose, switchToSignIn }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignUp({ name, email, password });
  };

  return (
    <form className="sign-up-form" onSubmit={handleSubmit}>
      <div className="container-1-sing-up">
        <div className="sign-up-container">
          <p>Sign Up</p>
        </div>
        <div className="delete-icon-container">
          <img
            className="delete-icon-img"
            src={deleteIcon}
            alt="Close"
            onClick={onClose}
          />
        </div>
      </div>

      <div className="container-2-personal-information">
        <label htmlFor="your-name" className="name-label-container">
          <input
            id="your-name"
            className="your-name-box"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label htmlFor="email" className="email-label-container">
          <input
            id="email"
            className="your-email-box"
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label htmlFor="password" className="password-label-container">
          <input
            id="password"
            className="your-password-box"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
      </div>

      <div className="container-3-create-button">
        <button type="submit">Create Account</button>
      </div>

      <div className="container-4-already-account">
        <p className="already-account-p">Already have an account?</p>
        <p className="click-here-p" onClick={switchToSignIn}>
          Click here
        </p>
      </div>
    </form>
  );
}
