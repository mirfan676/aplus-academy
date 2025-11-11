import React, { useState, useEffect } from "react";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem("cookieConsent");
    if (!storedConsent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    if (window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
    }
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    if (window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }
    setVisible(false);
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
        color: "#000",
        padding: "15px 10px",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <p style={{ margin: "5px 0", textAlign: "center" }}>
        We use cookies to improve your browsing experience, analyze traffic, and
        show relevant ads. Do you accept?
      </p>
      <div style={{ marginTop: "8px" }}>
        <button
          onClick={handleAccept}
          style={{
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            marginRight: "8px",
            cursor: "pointer",
          }}
        >
          Accept
        </button>
        <button
          onClick={handleReject}
          style={{
            backgroundColor: "#e0e0e0",
            color: "#000",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
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
