import React from "react";

export default function Modal({ visible, title, onClose, children }) {
  if (!visible) return null;

  return (
    <>
      {/* Arka plan */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(6px)", 
          zIndex: 999,
        }}
        onClick={onClose}
      />

      {/* Modal içerik */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "95vw",       
          maxWidth: 1300,     
          height: "85vh",      
          backgroundColor: "white",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          zIndex: 1000,
          overflow: "hidden", 
        }}
        onClick={(e) => e.stopPropagation()} 
      >
        <header
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 id="modal-title" style={{ margin: 0 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "transparent",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              lineHeight: 1,
              padding: 0,
            }}
          >
            ×
          </button>
        </header>

        {/* Modal içeriği */}
        <div
          style={{
            flexGrow: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
