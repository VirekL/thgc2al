import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useDateFormat } from './DateFormatContext';

export default function Sidebar() {
  const router = useRouter();
  const { dateFormat, setDateFormat } = useDateFormat();
  const [showSettings, setShowSettings] = useState(false);

  const handleRandomClick = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Random button clicked');
    const res = await fetch('/achievements.json');
    const data = await res.json();
    console.log('Fetched achievements:', data);
    const valid = data.filter(a => a && a.id && a.name);
    if (valid.length > 0) {
      const random = valid[Math.floor(Math.random() * valid.length)];
      console.log('Redirecting to:', `/achievement/${random.id}`);
      router.push(`/achievement/${random.id}`);
    } else {
      console.log('No valid achievements found');
    }
  }, [router]);

  return (
    <nav className="sidebar">
      <Link href="/list" className="sidebar-link">Main List</Link>
      <Link href="/timeline" className="sidebar-link">Timeline</Link>
      <Link href="/leaderboard" className="sidebar-link">Leaderboard</Link>
      <Link href="/submission-stats" className="sidebar-link">Submission Stats</Link>
      <a href="#" id="random-achievement-btn" className="sidebar-link" onClick={handleRandomClick} role="button" tabIndex={0}>Random</a>
      <Link href="/about-us" className="sidebar-link">About Us</Link>
      {/* Settings button as a sidebar-link */}
      <a
        href="#"
        className="sidebar-link"
        aria-label="Open settings"
        title="Open settings"
        onClick={e => { e.preventDefault(); setShowSettings(true); }}
        tabIndex={0}
        role="button"
      >
        Settings
      </a>
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
                    value="YYYY/MM/DD"
                    checked={dateFormat === "YYYY/MM/DD"}
                    onChange={() => setDateFormat("YYYY/MM/DD")}
                    style={{ marginRight: 8 }}
                  />
                  YYYY/MM/DD
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
      <div style={{position: "relative", width: "100%", paddingBottom: "350px"}}>
        <iframe
          src="https://discord.com/widget?id=1122038339541934091&theme=dark"
          style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}}
          allowTransparency="true"
          frameBorder="0"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        ></iframe>
      </div>
    </nav>
  );
}
