import { useState, useEffect } from "react";
import { useDateFormat } from "./DateFormatContext";

export default function Header() {
  // Splash text state
  const [splashText, setSplashText] = useState("");

  useEffect(() => {
    // Fetch splash texts from public folder
    fetch("/splash-text.json")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const randomSplash = data[Math.floor(Math.random() * data.length)];
          setSplashText(randomSplash);
        }
      })
      .catch(() => setSplashText(""));
  }, []);

  return (
    <header style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", padding: "1rem 2rem", backgroundColor: "var(--secondary-bg)", boxShadow: "var(--shadow)" }}>
      <div className="header-left">
        <button id="mobile-hamburger-btn" className="mobile-hamburger-btn" type="button" aria-label="Open sidebar" title="Open sidebar menu">
          <span className="bi bi-list" style={{fontSize: "2rem", color: "#DFE3F5"}} aria-hidden="true"></span>
        </button>
        <div className="logo">
          <img src="/assets/favicon-96x96.png" alt="The Hardest Achievements List Logo" title="The Hardest Achievements List Logo" />
        </div>
        <h1 className="title">The Hardest Achievements List</h1>
      </div>
      {/* Splash text only, settings button removed */}
      <div style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
        <div className="splash-text">{splashText}</div>
      </div>
    </header>
  );
}
