//Header.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOrder } from "../components/OrderContent";
import { useAuth } from "../hooks/useAuth.js";
import "../styles/Header.css";
import shoppingCart from "../images/shooping-cart.png";
import profileImage from "../images/profile-image.png";
import Alert from "./Alert.jsx";
import { SignInForm, SignUpForm } from "./AuthForms.jsx";
import ContactUsForm from "./ContactUsForm.jsx";

const Header = ({ scrollToMenu, scrollToHome }) => {
  const {
    isLoggedIn,
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

  const [modalType, setModalType] = useState(null);
  const [showContact, setShowContact] = useState(false);

  const handleCartClick = () => {
    if (!isLoggedIn) {
      setAlertMessage("Log in to order products!");
      setShowAlert(true);
      setProgress(0);
      setModalType("signin");
      return;
    }

    if (state.order.length > 0) {
      navigate("/summary");
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
          <a onClick={() => setShowContact(true)}>Contact Us</a>
          <a onClick={() => setModalType("signin")}> Profile </a>
        </div>
      </div>

      <div className="right-section-header">
        <div className="cart-img-container" onClick={handleCartClick}>
          <img src={shoppingCart} className="cart-img" alt="Cart" />
          {state.showCartTooltip && (
            <div className="tooltip-cart visible"></div>
          )}
        </div>

        <div
          className="profile-img-container"
          onClick={() => setModalType("signin")}
        >
          <img src={profileImage} className="profile-img" alt="Profile" />
        </div>

        <div className="sign-in-button-container">
          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                setAlertMessage("Logged out successfully");
                setShowAlert(true);
                setProgress(0);
              }}
              style={{ backgroundColor: "gray", color: "white" }}
            >
              Log out
            </button>
          ) : (
            <button
              onClick={() => setModalType("signin")}
              style={{ backgroundColor: "red", color: "white" }}
            >
              Sign in
            </button>
          )}
        </div>
      </div>

      {showAlert && (
        <Alert
          message={alertMessage}
          progress={progress}
          onClose={() => {
            setShowAlert(false);
            setProgress(0);
          }}
          key={alertKey}
        />
      )}

      {modalType === "signin" && (
        <SignInForm
          onLogin={({ email, password }) => {
            handleLogin({ email, password }, () => setModalType(null));
          }}
          onClose={() => setModalType(null)}
          switchToSignUp={() => setModalType("signup")}
        />
      )}

      {modalType === "signup" && (
        <SignUpForm
          onSignUp={({ name, email, password }) => {
            handleSignUp({ name, email, password }, () => setModalType(null));
          }}
          onClose={() => setModalType(null)}
          switchToSignIn={() => setModalType("signin")}
        />
      )}

      {showContact && (
        <ContactUsForm
          onClose={() => setShowContact(false)}
          onSend={(e) => {
            e.preventDefault();
            setAlertMessage("Thank you for your message!");
            setShowAlert(true);
            setProgress(0);
            setShowContact(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
