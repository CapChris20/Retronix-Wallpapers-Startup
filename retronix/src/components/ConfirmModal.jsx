import React from "react";

const modalStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.75)",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const boxStyles = {
  background: "linear-gradient(135deg, #1a002b 0%, #ff00cc 100%)",
  border: "2.5px solid #ff00ff",
  borderRadius: "24px",
  boxShadow: "0 0 32px #ff00ff, 0 0 64px #00fff7",
  padding: "2.5rem 2rem 2rem 2rem",
  minWidth: 375,
  maxWidth: 500,
  minHeight: 290,
  maxHeight: 290,
  textAlign: "center",
  fontFamily: "'Press Start 2P', monospace",
  color: "#fff",
  position: "relative",
  animation: "modalPop 0.25s cubic-bezier(.4,2,.6,1)",
};

const buttonRow = {
  display: "flex",
  justifyContent: "center",
  gap: "1.5rem",
  marginTop: "2.2rem",
};

const btn = {
  fontFamily: "'Press Start 2P', monospace",
  fontSize: "0.8rem",
  padding: "0.7rem 1.3rem",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  textTransform: "uppercase",
  boxShadow: "0 0 12px #ff00cc, 0 0 8px #00fff7",
  transition: "all 0.18s cubic-bezier(.4,2,.6,1)",
};

const confirmBtn = {
  ...btn,
  background: "linear-gradient(90deg, #ff00cc 0%, #00fff7 100%)",
  color: "#fff",
};

const cancelBtn = {
  ...btn,
  background: "linear-gradient(90deg, #2d006e 0%, #bc1577 100%)",
  color: "#fff",
};

// Keyframes for pop animation
const styleSheet = document.createElement("style");
styleSheet.innerText = `@keyframes modalPop {0%{transform:scale(0.8);}100%{transform:scale(1);}}`;
document.head.appendChild(styleSheet);

function ConfirmModal({ open, onConfirm, onCancel, children }) {
  if (!open) return null;

  return (
    <div style={modalStyles}>
      <div style={boxStyles}>
        <div
       style={{
        fontSize: "1.3rem",
        marginBottom: "1.5rem",
        color: "rgb(236, 233, 227)", // ✅ Neon yellow
        textShadow: "1px 1px rgb(208, 28, 154), 1px 2px rgb(208, 28, 154), 1px 3px rgb(208, 28, 154), 1px 4px rgb(208, 28, 154), 1px 5px rgb(208, 28, 154), 1px 6px rgb(208, 28, 154)"
      }}
        >
          {children}
        </div>
        <div style={buttonRow}>
          <button style={confirmBtn} onClick={onConfirm}>Confirm</button>
          <button style={cancelBtn} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;