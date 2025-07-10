import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function Header({ children }) {
  // Splash text state
  const [splashText, setSplashText] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 900);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="main-header">
      <div className="header-bar">
        <button
          id="mobile-hamburger-btn"
          className="mobile-hamburger-btn"
          type="button"
          aria-label="Open sidebar"
          title="Open sidebar menu"
          onClick={() => isMobile && setShowSidebar(true)}
        >
          <span className="bi bi-list hamburger-icon" aria-hidden="true"></span>
        </button>
        <div className="logo">
          <img src="/assets/favicon-96x96.png" alt="The Hardest Achievements List Logo" title="The Hardest Achievements List Logo" className="logo-img" />
        </div>
        <h1 className="title main-title">The Hardest Achievements List</h1>
        {children && <div className="header-children">{children}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
        {!isMobile && <div className="splash-text">{splashText}</div>}
      </div>
      {/* Mobile Sidebar Overlay */}
      {isMobile && showSidebar && (
        <div
          className="sidebar-mobile-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.75)",
            zIndex: 1001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={() => setShowSidebar(false)}
        >
          <div
            className="sidebar sidebar-mobile-open"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1002,
              width: "90vw",
              maxWidth: 350,
              maxHeight: "90vh",
              boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
              display: "flex",
              flexDirection: "column",
              background: "var(--secondary-bg)",
              borderRadius: "1.2rem",
              overflowY: "auto"
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              aria-label="Close sidebar"
              title="Close sidebar"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "none",
                border: "none",
                color: "#DFE3F5",
                fontSize: 28,
                cursor: "pointer",
                zIndex: 1003
              }}
              onClick={() => setShowSidebar(false)}
            >
              ×
            </button>
            <Sidebar />
          </div>
        </div>
      )}
    </header>
  );
}
