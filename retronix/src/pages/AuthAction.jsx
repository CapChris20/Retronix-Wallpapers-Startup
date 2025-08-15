import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { verifyPasswordResetCode, confirmPasswordReset, applyActionCode } from "firebase/auth";

function AuthAction() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!mode || !oobCode) {
      setError("Invalid or missing action code.");
      return;
    }

    if (mode === "verifyEmail") {
      applyActionCode(auth, oobCode)
        .then(() => {
          setMessage("Email verified successfully. Redirecting to login...");
          setTimeout(() => navigate("/login"), 2500);
        })
        .catch(() => setError("Invalid or expired verification link."));
    } else if (mode === "resetPassword") {
      verifyPasswordResetCode(auth, oobCode)
        .then((email) => setEmail(email))
        .catch(() => setError("Invalid or expired password reset link."));
    }
  }, [mode, oobCode, navigate]);

  const handlePasswordReset = async () => {
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage("Password reset successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError("Failed to reset password. Try again.");
    }
  };

  return (
    <div
      className="auth-action-container"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/Auth.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="auth-action-content"
        style={{
          background: "rgba(0,0,0,0.92)",
          borderRadius: "18px",
          boxShadow: "0 0 24px #ff00cc, 0 0 8px #00fff7",
          padding: "2.5rem 2.5rem 2rem 2.5rem",
          maxWidth: "420px",
          width: "100%",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h1 style={{  fontFamily: "'Press Start 2P', monospace",
  fontWeight: "bolder",
  fontSize: "2.6rem",
  lineHeight: 2.6,
  textAlign: "center",
  color: "#ff99cc",
  textShadow: `
    1px 1px rgb(191, 0, 255),
    1px 2px rgb(191, 0, 255),
    1px 3px rgb(191, 0, 255),
    1px 4px rgb(191, 0, 255),
    1px 5px rgb(191, 0, 255),
    1px 6px rgb(191, 0, 255)
  `,
  marginTop: 0,
  paddingTop: 0 }}>
          Retronix Account Action
        </h1>
        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}
        {mode === "resetPassword" && !message && (
          <div>
            <p style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "1.2rem", wordBreak: "break-all" }}>
              Resetting password for: <strong>{email}</strong>
            </p>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                width: "100%",
                marginBottom: "1rem",
                padding: "0.7rem 1rem",
                borderRadius: "8px",
                border: "none",
                fontSize: "1rem",
                fontFamily: "'Press Start 2P', monospace",
                background: "#181028",
                color: "#fff",
                boxShadow: "0 0 8px #ff00cc",
              }}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "100%",
                marginBottom: "1.2rem",
                padding: "0.7rem 1rem",
                borderRadius: "8px",
                border: "none",
                fontSize: "1rem",
                fontFamily: "'Press Start 2P', monospace",
                background: "#181028",
                color: "#fff",
                boxShadow: "0 0 8px #ff00cc",
              }}
            />
            <button
              onClick={handlePasswordReset}
              style={{
                width: "100%",
                padding: "0.9rem 0",
                borderRadius: "8px",
                border: "none",
                fontFamily: "'Press Start 2P', monospace",
                background: "linear-gradient(120deg, #ff00cc 0%, #2d006e 100%)",
                color: "#fff",
                fontSize: "1.1rem",
                boxShadow: "0 0 18px #a259f7cc",
                textShadow: "0 0 8px #a259f7, 0 0 2px #ff00cc",
                cursor: "pointer",
                marginBottom: "0.5rem",
                transition: "transform 0.18s cubic-bezier(.4,2,.6,1), filter 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s cubic-bezier(.4,2,.6,1)",
              }}
            >
              Reset Password
            </button>
          </div>
        )}
        {mode === "verifyEmail" && !message && <p>Verifying your email...</p>}
      </div>
    </div>
  );
}

export default AuthAction;
