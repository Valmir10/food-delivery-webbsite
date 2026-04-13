import { useState, useEffect } from "react";

export function useAlert() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [key, setKey] = useState(0);

  const showAlert = (msg) => {
    setMessage(msg);
    setVisible(true);
    setProgress(0);
    setKey((k) => k + 1);
  };

  useEffect(() => {
    if (!visible) return;

    if (progress < 100) {
      const timer = setInterval(() => {
        setProgress((p) => p + 1);
      }, 40);
      return () => clearInterval(timer);
    } else {
      setVisible(false);
      setProgress(0);
    }
  }, [visible, progress]);

  return {
    alertProps: {
      message,
      progress,
      onClose: () => {
        setVisible(false);
        setProgress(0);
      },
    },
    key,
    showAlert,
    visible,
  };
}
