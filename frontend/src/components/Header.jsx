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
  const { cart } = useCartContext();

  const navigate = useNavigate();
  const location = useLocation();

  const [modalType, setModalType] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    if (!showAlert) return;
    if (progress < 100) {
      const interval = setInterval(() => setProgress((prev) => prev + 1), 50);
      return () => clearInterval(interval);
    } else {
      setShowAlert(false);
      setProgress(0);
    }
  }, [progress, showAlert]);

  const handleHomeClick = () => {
    setMobileMenuOpen(false);
    if (location.pathname === "/") {
      scrollToHome?.();
    } else {
      navigate("/");
    }
  };

  const handleMenuClick = () => {
    setMobileMenuOpen(false);
    if (location.pathname === "/") {
      scrollToMenu?.();
    } else {
      navigate("/");
    }
  };

  const handleProfileClick = () => {
    setMobileMenuOpen(false);
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      setModalType("signin");
    }
  };

  return (
    <header className="header">
      <div className="left-container">
        <h1 className="company-name" onClick={handleHomeClick}>
          UrbanEats
        </h1>
      </div>

      <button
        className={`hamburger ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`middle-container ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="list-container">
          <a onClick={handleHomeClick}>Home</a>
          <a onClick={handleMenuClick}>Menu</a>
          <a onClick={() => { setShowContact(true); setMobileMenuOpen(false); }}>Contact Us</a>
          <a onClick={handleProfileClick}>Profile</a>
        </div>
      </nav>

      <div className="right-section-header">
        <div className="cart-img-container" onClick={handleCartClick}>
          <img src={shoppingCart} className="cart-img" alt="Cart" />
          {cart.length > 0 && (
            <div className="tooltip-cart visible">
              <span>{cart.length}</span>
            </div>
          )}
        </div>

        <div className="profile-img-container" onClick={handleProfileClick}>
          <img src={profileImage} className="profile-img" alt="Profile" />
        </div>

        <div className="sign-in-button-container">
          {isLoggedIn ? (
            <button
              className="btn-logout"
              onClick={() => {
                logout();
                showAlertMessage("Logged out successfully");
                navigate("/");
              }}
            >
              Log out
            </button>
          ) : (
            <button className="btn-signin" onClick={() => setModalType("signin")}>
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
          onClose={() => { setShowAlert(false); setProgress(0); }}
        />
      )}

      {modalType === "signin" && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div onClick={(e) => e.stopPropagation()}>
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
          </div>
        </div>
      )}

      {modalType === "signup" && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div onClick={(e) => e.stopPropagation()}>
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
          </div>
        </div>
      )}

      {showContact && (
        <div className="modal-overlay" onClick={() => setShowContact(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <ContactUsForm
              onClose={() => setShowContact(false)}
              onSend={(e) => {
                e.preventDefault();
                showAlertMessage("Thank you for your message!");
                setShowContact(false);
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;