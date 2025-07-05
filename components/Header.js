import { useState } from "react";

export default function Header() {
  const [showSettings, setShowSettings] = useState(false);
  const [dateFormat, setDateFormat] = useState("Month D, Yr");
  return (
    <header style={{ position: "relative" }}>
      <div className="header-left">
        <button id="mobile-hamburger-btn" className="mobile-hamburger-btn" type="button" aria-label="Open sidebar" title="Open sidebar menu">
          <span className="bi bi-list" style={{fontSize: "2rem", color: "#DFE3F5"}} aria-hidden="true"></span>
        </button>
        <div className="logo">
          <img src="/assets/favicon-96x96.png" alt="The Hardest Achievements List Logo" title="The Hardest Achievements List Logo" />
        </div>
        <h1 className="title">The Hardest Achievements List</h1>
      </div>
      {/* Settings button on the right */}
      <button
        className="settings-btn"
        aria-label="Open settings"
        title="Open settings"
        style={{
          position: "absolute",
          right: 24,
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 8,
          zIndex: 10
        }}
        onClick={() => setShowSettings(true)}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DFE3F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 9 3.09V3a2 2 0 1 1 4 0v.09c0 .66.39 1.26 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09c.22.61.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.66 0-1.26.39-1.51 1z"/></svg>
      </button>
      <div id="splash-text" style={{fontStyle: "italic", color: "#4d566e", marginTop: "0.2em", fontSize: "1.1em"}}></div>
      {/* Settings Modal */}
      {showSettings && (
        <div
          className="settings-modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={() => setShowSettings(false)}
        >
          <div
            className="settings-modal"
            style={{
              background: "#23283E",
              borderRadius: 12,
              padding: 32,
              minWidth: 300,
              minHeight: 180,
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative"
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              aria-label="Close settings"
              title="Close"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "none",
                border: "none",
                color: "#DFE3F5",
                fontSize: 24,
                cursor: "pointer"
              }}
              onClick={() => setShowSettings(false)}
            >
              ×
            </button>
            <h2 style={{ color: "#DFE3F5", marginBottom: 24 }}>Settings</h2>
            <div style={{ width: "100%", marginBottom: 12 }}>
              <label style={{ color: "#DFE3F5", fontWeight: 600, fontSize: 16, marginBottom: 8, display: "block" }}>Date Format</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ color: "#DFE3F5", fontSize: 15, cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="date-format"
                    value="Month D, Yr"
                    checked={dateFormat === "Month D, Yr"}
                    onChange={() => setDateFormat("Month D, Yr")}
                    style={{ marginRight: 8 }}
                  />
                  Month D, Yr (Default)
                </label>
                <label style={{ color: "#DFE3F5", fontSize: 15, cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="date-format"
                    value="YY/MM/DD"
                    checked={dateFormat === "YY/MM/DD"}
                    onChange={() => setDateFormat("YY/MM/DD")}
                    style={{ marginRight: 8 }}
                  />
                  YY/MM/DD
                </label>
                <label style={{ color: "#DFE3F5", fontSize: 15, cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="date-format"
                    value="MM/DD/YY"
                    checked={dateFormat === "MM/DD/YY"}
                    onChange={() => setDateFormat("MM/DD/YY")}
                    style={{ marginRight: 8 }}
                  />
                  MM/DD/YY
                </label>
                <label style={{ color: "#DFE3F5", fontSize: 15, cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="date-format"
                    value="DD/MM/YY"
                    checked={dateFormat === "DD/MM/YY"}
                    onChange={() => setDateFormat("DD/MM/YY")}
                    style={{ marginRight: 8 }}
                  />
                  DD/MM/YY
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
