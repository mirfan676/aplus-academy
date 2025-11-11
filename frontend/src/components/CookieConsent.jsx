import React, { useState, useEffect } from "react";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consentGiven = localStorage.getItem("cookieConsent");
    if (!consentGiven) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (granted) => {
    localStorage.setItem("cookieConsent", granted ? "granted" : "denied");
    setVisible(false);

    if (window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: granted ? "granted" : "denied",
        analytics_storage: granted ? "granted" : "denied",
      });
    }
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
        padding: "16px",
        textAlign: "center",
        zIndex: 1000,
      }}
    >
      <p style={{ marginBottom: "8px" }}>
        We use cookies to improve your experience and analyze website traffic.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
        <button
          onClick={() => handleConsent(true)}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Accept
        </button>
        <button
          onClick={() => handleConsent(false)}
          style={{
            backgroundColor: "#f1f1f1",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
