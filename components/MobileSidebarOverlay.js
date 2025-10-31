import React from 'react';
import Sidebar from './Sidebar';

export default function MobileSidebarOverlay({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
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
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div
        className="sidebar-mobile-modal"
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
          onClick={onClose}
        >
          ×
        </button>
  <Sidebar onClose={onClose} />
      </div>
    </div>
  );
}
