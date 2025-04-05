//Header.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOrder } from "../components/OrderContent";
import { useAuth } from "../hooks/useAuth";
import "./Header.css";
import searchIconImage from "../images/search-icon.png";
import shoppingCart from "../images/shooping-cart.png";
import profileImage from "../images/profile-image.png";
import deleteIcon from "../images/cancel.png";
import exclamationImage from "../images/exclamation.png";

const Header = ({ scrollToMenu, scrollToHome }) => {
  const {
    isLoggedIn,
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    alertMessage,
    setAlertMessage,
    showAlert,
    setShowAlert,
    alertKey,
    progress,
    handleLogin,
    handleSignUp,
    handleLogout,
    setProgress,
  } = useAuth();

  const { state, dispatch } = useOrder();
  const navigate = useNavigate();
  const location = useLocation();

  const [showSignUp, setShowSignUp] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showContactUs, setShowContactUs] = useState(false);

  const handleProfileClick = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const handleCloseContactUs = () => {
    setShowContactUs(false);
  };

  const handleFormSwitch = () => {
    setShowSignUp(!showSignUp);
    setAlertMessage("");
    setShowAlert(false);
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      setAlertMessage("Log in to order products!");
      setShowAlert(true);
      setProgress(0);
      setIsFormVisible(true);
      setShowSignUp(true);
      return;
    }

    if (state.order.length > 0) {
      navigate("/order-summary");
    } else {
      dispatch({ type: "HIDE_CART_TOOLTIP" });
      setAlertMessage("Your cart is empty! Add products before proceeding.");
      setShowAlert(true);
      setProgress(0);
    }
  };

  useEffect(() => {
    if (state.order.length > 0 || state.showCartTooltip) {
      dispatch({ type: "SHOW_CART_TOOLTIP" });
    }
  }, [state.order, state.showCartTooltip, dispatch]);

  useEffect(() => {
    if (progress < 100 && showAlert) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => prevProgress + 1);
      }, 50);
      return () => clearInterval(interval);
    } else if (progress >= 100) {
      setShowAlert(false);
      setProgress(0);
    }
  }, [progress, showAlert]);

  const handleDeleteAlert = () => {
    setShowAlert(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setAlertMessage("Thank you for your message!");
    setShowAlert(true);
    setProgress(0);
    setShowContactUs(false);
  };

  const handleHomeClick = () => {
    if (location.pathname === "/") {
      scrollToHome();
    } else {
      navigate("/");
    }
  };

  const handleMenuClick = () => {
    if (location.pathname === "/") {
      scrollToMenu();
    } else {
      navigate("/");
    }
  };

  return (
    <header className="header">
      <div className="left-container">
        <h1 className="company-name" onClick={handleHomeClick}>
          UrbanEats
        </h1>
      </div>
      <div className="middle-container">
        <div className="list-container">
          <a onClick={handleHomeClick}>Home</a>
          <a onClick={handleMenuClick}>Menu</a>
          <a onClick={() => setShowContactUs(true)}>Contact Us</a>
          <a onClick={handleProfileClick}>Profile</a>
        </div>
      </div>

      <div className="right-section-header">
        <div className="cart-img-container" onClick={handleCartClick}>
          <img src={shoppingCart} className="cart-img" alt="Cart" />
          {state.showCartTooltip && (
            <div className="tooltip-cart visible"></div>
          )}
        </div>

        <div className="profile-img-container" onClick={handleProfileClick}>
          <img src={profileImage} className="profile-img" alt="Profile" />
        </div>

        <div className="sign-in-button-container">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              style={{ backgroundColor: "gray", color: "white" }}
            >
              Log out
            </button>
          ) : (
            <button
              onClick={handleProfileClick}
              style={{ backgroundColor: "red", color: "white" }}
            >
              Sign in
            </button>
          )}
        </div>
      </div>

      {isFormVisible && (
        <div>
          {showSignUp ? (
            <form className="sign-up-form" onSubmit={handleSignUp}>
              <div className="container-1-sing-up">
                <div className="sign-up-container">
                  <p>Sign Up</p>
                </div>
                <div className="delete-icon-container">
                  <img
                    className="delete-icon-img"
                    src={deleteIcon}
                    alt="Delete"
                    onClick={handleCloseForm}
                  />
                </div>
              </div>
              <div className="container-2-personal-information">
                <label for="your-name" className="name-label-container">
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

                <label className="email-label-container" htmlFor="email">
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

                <label className="password-label-container" htmlFor="password">
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
                <p className="click-here-p" onClick={handleFormSwitch}>
                  Click here
                </p>
              </div>
            </form>
          ) : (
            <form
              className="sign-in-form"
              onSubmit={(e) => handleLogin(e, setIsFormVisible)}
            >
              <div className="container-1-sing-in">
                <div className="sign-in-container">
                  <p>Sign In</p>
                </div>

                <div className="delete-icon-container">
                  <img
                    className="delete-icon-img"
                    src={deleteIcon}
                    alt="Delete"
                    onClick={handleCloseForm}
                  />
                </div>
              </div>
              <div className="container-2-personal-information-sign-in">
                <label className="sign-in-emai-label" htmlFor="sign-in-email">
                  <input
                    id="sign-in-email"
                    className="your-email-box"
                    type="text"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>

                <label
                  className="sign-in-password-label"
                  htmlFor="your-password"
                >
                  <input
                    id="your-password"
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
                <p className="click-here-p" onClick={handleFormSwitch}>
                  Click here
                </p>
              </div>
            </form>
          )}
        </div>
      )}

      {showContactUs && (
        <form
          className="contact-us-form-container"
          onSubmit={handleSendMessage}
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
                onClick={handleCloseContactUs}
              />
            </div>
          </div>

          <div className="personal-information-container-contact">
            <label className="your-name-box-container" htmlFor="your-name-box">
              <input
                id="your-name-box"
                type="text"
                placeholder="Your Name"
                required
              />
            </label>

            <label
              className="your-email-box-container"
              htmlFor="your-email-box"
            >
              <input
                id="your-email-box"
                type="text"
                placeholder="Your Email"
                required
              />
            </label>
          </div>

          <div className="your-message-container">
            <label
              htmlFor="your-message-box"
              className="your-message-label-container"
            >
              <textarea
                id="your-message-box"
                type="text"
                placeholder="Message"
                required
              />
            </label>
          </div>

          <div
            id="send-message-contact-us"
            className="container-3-create-button"
          >
            <button type="submit">Send</button>
          </div>
        </form>
      )}
      {showAlert && (
        <div className="alert-container" key={alertKey}>
          <div className="alert-content-container">
            <div className="alert-image-container">
              <img src={exclamationImage} alt="Exclamation" />
            </div>
            <div className="alert-message-container">
              <p>{alertMessage}</p>
            </div>
            <img
              className="delete-icon-alert"
              src={deleteIcon}
              alt="Delete Alert"
              onClick={() => {
                console.log("Alert closed manually.");
                setShowAlert(false);
                setProgress(0);
              }}
            />
          </div>
          <div className="alert-loading-bar">
            <div
              className="alert-progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
