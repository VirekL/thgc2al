import React, { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createPortal } from 'react-dom';
import { useDateFormat } from './DateFormatContext';

function SidebarInner() {
  const router = useRouter();
  const { dateFormat, setDateFormat } = useDateFormat();
  const [showSettings, setShowSettings] = useState(false);

  const [itemsPerPage, setItemsPerPage] = useState(() => {
    try {
      if (typeof window === 'undefined') return 100;
      const v = localStorage.getItem('itemsPerPage');
      if (!v) return 100;
      return v === 'all' ? 'all' : Number(v) || 100;
    } catch (e) {
      return 100;
    }
  });

  const handleRandomClick = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const res = await fetch('/achievements.json');
      const data = await res.json();
      const valid = data.filter((a) => a && a.id && a.name);
      if (valid.length > 0) {
        const random = valid[Math.floor(Math.random() * valid.length)];
        router.push(`/achievement/${random.id}`);
      }
    },
    [router]
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav
      className="sidebar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: 'calc(100vh - 2rem)',
        /* make the sidebar itself scrollable so the scrollbar appears on the sidebar when needed */
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div style={{ flex: '1 1 auto', minHeight: 0 }}>
        <Link href="/list" className="sidebar-link">
          Main List
        </Link>
        <Link href="/timeline" className="sidebar-link">
          Timeline
        </Link>
        <Link href="/leaderboard" className="sidebar-link">
          Leaderboard
        </Link>
        <Link href="/submission-stats" className="sidebar-link">
          Submission Stats
        </Link>
        <a
          href="#"
          id="random-achievement-btn"
          className="sidebar-link"
          onClick={handleRandomClick}
          role="button"
          tabIndex={0}
        >
          Random
        </a>
        <Link href="/about-us" className="sidebar-link">
          About Us
        </Link>
        <a
          href="#"
          className="sidebar-link"
          aria-label="Open settings"
          title="Open settings"
          onClick={(e) => {
            e.preventDefault();
            setShowSettings(true);
          }}
          tabIndex={0}
          role="button"
        >
          Settings
        </a>
      </div>

      <div
        style={{
          flex: '0 0 auto',
          position: 'relative',
          width: '100%',
          height: '350px',
          maxHeight: '35vh',
          minHeight: 120,
          overflow: 'hidden',
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 12,
        }}
      >
        <Link href="/discord">
          <a
            className="sidebar-link discord-link"
            role="button"
            aria-label="Open Discord page"
            title="Open Discord"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 18px',
              background: '#5865F2',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <path d="M20.317 4.369A19.791 19.791 0 0016.82 3c-.03.05-.065.12-.09.17-1.542 2.276-3.31 4.13-5.18 5.533-2.345 1.7-4.525 2.842-6.23 3.476a6.868 6.868 0 00-.45.177c1.02-.23 2.008-.523 2.942-.868 1.513-.57 2.96-1.315 4.373-2.215 1.457-.92 2.87-2.106 4.137-3.55.03-.03.058-.06.087-.09.38-.123.77-.243 1.153-.365z" fill="#ffffff" />
              <path d="M7.119 15.456c-1.487-.41-2.473-1.01-3.095-1.71 1.074.227 2.184.35 3.328.346 1.202-.004 2.43-.118 3.678-.35 1.879-.323 3.852-.97 5.768-1.888a26.026 26.026 0 003.3-1.61c-.76.967-1.703 1.783-2.77 2.39-1.527.92-3.128 1.603-4.78 2.053a32.767 32.767 0 01-5.43 1.36 33.06 33.06 0 01-1.01.09z" fill="#ffffff" />
            </svg>
            <span>Open Discord</span>
          </a>
        </Link>
      </div>

      {showSettings &&
        mounted &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="settings-modal-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2147483647,
              padding: 12,
            }}
            onClick={() => setShowSettings(false)}
          >
            <div
              className="settings-modal"
              style={{
                background: '#23283E',
                borderRadius: 12,
                padding: 32,
                minWidth: 280,
                maxWidth: 'min(680px, 96vw)',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                aria-label="Close settings"
                title="Close"
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: 'none',
                  border: 'none',
                  color: '#DFE3F5',
                  fontSize: 24,
                  cursor: 'pointer',
                }}
                onClick={() => setShowSettings(false)}
              >
                ×
              </button>
              <h2 style={{ color: '#DFE3F5', marginBottom: 24 }}>Settings</h2>

              <div style={{ width: '100%', marginBottom: 12 }}>
                <label
                  style={{
                    color: '#DFE3F5',
                    fontWeight: 600,
                    fontSize: 16,
                    marginBottom: 8,
                    display: 'block',
                  }}
                >
                  Date Format
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['Month D, Yr', 'YYYY/MM/DD', 'MM/DD/YY', 'DD/MM/YY'].map(
                    (format) => (
                      <label
                        key={format}
                        style={{
                          color: '#DFE3F5',
                          fontSize: 15,
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="radio"
                          name="date-format"
                          value={format}
                          checked={dateFormat === format}
                          onChange={() => setDateFormat(format)}
                          style={{ marginRight: 8 }}
                        />
                        {format}
                      </label>
                    )
                  )}
                </div>
              </div>

              <div style={{ width: '100%', marginTop: 12 }}>
                <label
                  style={{
                    color: '#DFE3F5',
                    fontWeight: 600,
                    fontSize: 16,
                    marginBottom: 8,
                    display: 'block',
                  }}
                >
                  Items Rendered
                </label>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                  }}
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="100"
                    value={itemsPerPage === 'all' ? '' : String(itemsPerPage)}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, '');
                      const n = raw === '' ? '' : Number(raw);
                      setItemsPerPage(n === '' ? '' : n);
                      try {
                        if (raw !== '') localStorage.setItem('itemsPerPage', String(n));
                      } catch { }
                    }}
                    onBlur={() => {
                      if (itemsPerPage === '' || itemsPerPage === 0) {
                        setItemsPerPage(100);
                        try {
                          localStorage.setItem('itemsPerPage', '100');
                        } catch { }
                      }
                    }}
                    style={{
                      padding: 8,
                      background: '#2a2f44',
                      color: '#DFE3F5',
                      borderRadius: 6,
                      border: '1px solid #3b4058',
                      width: 90,
                    }}
                  />
                  <label
                    style={{
                      color: '#DFE3F5',
                      fontSize: 14,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={itemsPerPage === 'all'}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setItemsPerPage('all');
                          try {
                            localStorage.setItem('itemsPerPage', 'all');
                          } catch { }
                        } else {
                          setItemsPerPage(100);
                          try {
                            localStorage.setItem('itemsPerPage', '100');
                          } catch { }
                        }
                      }}
                    />
                    All
                  </label>
                  <div style={{ color: '#DFE3F5', fontSize: 13 }}>
                    Enter a number (default 100) or check All to render everything
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </nav>
  );
}

export default SidebarInner;
