
import React, { useState, useEffect } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(
    !localStorage.getItem("cookieConsent")
  );

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    window.gtag("consent", "update", {
      ad_storage: "granted",
      analytics_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    window.gtag("consent", "update", {
      ad_storage: "denied",
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
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
        background: "#fff",
        color: "#000",
        borderTop: "1px solid #ccc",
        padding: "10px",
        textAlign: "center",
        zIndex: 1000,
      }}
    >
      <p style={{ margin: "5px 0" }}>
        We use cookies to improve your experience and analyze site usage. Do you
        consent to our use of cookies?
      </p>
      <button onClick={handleAccept} style={{ marginRight: "10px" }}>
        Accept
      </button>
      <button onClick={handleReject}>Reject</button>
    </div>
  );
}
