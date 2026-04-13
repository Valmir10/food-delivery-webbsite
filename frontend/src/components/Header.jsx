import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCartContext } from "../context/CartContext";
import "../styles/Header.css";
import shoppingCart from "../images/shopping-cart.png";
import profileImage from "../images/profile-image.png";
import Alert from "./Alert.jsx";
import { SignInForm, SignUpForm } from "./AuthForms.jsx";
import ContactUsForm from "./ContactUsForm.jsx";

const Header = ({ scrollToMenu, scrollToHome }) => {
  const { isLoggedIn, login, register, logout } = useAuth();
  const { cart, add, update } = useCartContext();

  const navigate = useNavigate();
  const location = useLocation();

  const [modalType, setModalType] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [showCartTooltip, setShowCartTooltip] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [progress, setProgress] = useState(0);
  const [alertKey, setAlertKey] = useState(0);

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setProgress(0);
    setAlertKey((prev) => prev + 1);
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      showAlertMessage("Log in to order products!");
      setModalType("signin");
      return;
    }

    if (cart.length > 0) {
      navigate("/summary");
    } else {
      showAlertMessage("Your cart is empty! Add products before proceeding.");
    }
  };

  useEffect(() => {
    setShowCartTooltip(cart.length > 0);
  }, [cart]);

  useEffect(() => {
    if (!showAlert) return;

    if (progress < 100) {
      const interval = setInterval(() => {
        setProgress((prev) => prev + 1);
      }, 50);
      return () => clearInterval(interval);
    } else {
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
          <a
            onClick={() => {
              if (!isLoggedIn) setModalType("signin");
            }}
          >
            Profile
          </a>
        </div>
      </div>

      <div className="right-section-header">
        <div className="cart-img-container" onClick={handleCartClick}>
          <img src={shoppingCart} className="cart-img" alt="Cart" />
          {showCartTooltip && <div className="tooltip-cart visible"></div>}
        </div>

        <div
          className="profile-img-container"
          onClick={() => {
            if (!isLoggedIn) setModalType("signin");
          }}
        >
          <img src={profileImage} className="profile-img" alt="Profile" />
        </div>

        <div className="sign-in-button-container">
          {isLoggedIn ? (
            <button
              onClick={() => {
                logout();
                showAlertMessage("Logged out successfully");
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
          key={alertKey}
          message={alertMessage}
          progress={progress}
          onClose={() => {
            setShowAlert(false);
            setProgress(0);
          }}
        />
      )}

      {modalType === "signin" && (
        <SignInForm
          onLogin={async ({ email, password }) => {
            try {
              await login(email, password);
              setModalType(null);
              showAlertMessage("Logged in successfully");
            } catch (err) {
              showAlertMessage(err.message);
            }
          }}
          onClose={() => setModalType(null)}
          switchToSignUp={() => setModalType("signup")}
        />
      )}

      {modalType === "signup" && (
        <SignUpForm
          onSignUp={async ({ name, email, password }) => {
            try {
              await register(name, email, password);
              setModalType(null);
              showAlertMessage("Account created!");
            } catch (err) {
              showAlertMessage(err.message);
            }
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
            showAlertMessage("Thank you for your message!");
            setShowContact(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;

/*
//Header.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOrder } from "./OrderContent.jsx";
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


*/
