// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../api.js";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertKey, setAlertKey] = useState(0);
  const [progress, setProgress] = useState(0);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showSignUp, setShowSignUp] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get(`${API_BASE}/api/user-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setIsLoggedIn(true);
        })

        .catch(() => {
          handleLogout();
        })
        .finally(() => {
          setIsAuthChecked(true);
        });
    } else {
      setIsAuthChecked(true);
    }
  }, []);

  const triggerAlert = (message) => {
    setShowAlert(false);
    setTimeout(() => {
      setAlertKey((prev) => prev + 1);
      setAlertMessage(message);
      setShowAlert(true);
    }, 100);
  };

  const handleLogin = async ({ email, password }, onSuccess) => {
    try {
      const response = await axios.post(`${API_BASE}/api/login`, {
        email,
        password,
      });

      const token = response.data.token;
      if (!token) throw new Error("No token received");

      localStorage.setItem("token", token);
      setIsLoggedIn(true);

      triggerAlert(response.data.message);
      resetForm();
      if (onSuccess) onSuccess();
    } catch (error) {
      triggerAlert(
        error.response?.data.message || `Unexpected error: ${error.message}`
      );
    }
  };

  const handleSignUp = async ({ name, email, password }, onSuccess) => {
    try {
      const response = await axios.post(`${API_BASE}/api/register`, {
        name,
        email,
        password,
      });

      const token = response.data.token;
      if (!token) throw new Error("No token received");

      localStorage.setItem("token", token);
      setIsLoggedIn(true);

      triggerAlert(response.data.message);
      resetForm();
      if (onSuccess) onSuccess();
    } catch (error) {
      triggerAlert(
        error.response?.data.message || `Unexpected error: ${error.message}`
      );
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_BASE}/api/logout`);

      localStorage.removeItem("token");
      localStorage.removeItem("cart");
      localStorage.removeItem("quantities");
      setIsLoggedIn(false);

      triggerAlert(response.data.message);
    } catch (error) {
      triggerAlert(
        error.response?.data.message || `Unexpected error: ${error.message}`
      );
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
  };

  return {
    isLoggedIn,
    isAuthChecked,
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
    isFormVisible,
    setIsFormVisible,
    showSignUp,
    setShowSignUp,
  };
};
