import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    setError("");
    setMessage("");
    try {
      // Get the current URL to determine the base URL for the reset link
      const currentUrl = window.location.origin;
      const resetUrl = `${currentUrl}/reset-password`;
      
      await sendPasswordResetEmail(auth, email, {
        url: resetUrl
      });
      setMessage("Password reset email sent! Please check your inbox.");
    } catch (err) {
      console.error("❌ Password reset failed:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="account-wrapper">
      <video autoPlay loop muted playsInline className="bg-video" preload="none" poster="/TODO-forgetpassword-poster.jpg">
        <source src="/login - signup.mp4" type="video/mp4" />
      </video>
      <div className="account-card" style={{ textAlign: "center", marginTop: "8rem" }}>
        <h1 className="ac-info" style={{ fontFamily: "'Press Start 2P', monospace", color: "#fff" }}>
          Reset Password
        </h1>
     <input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  style={{
    background: "rgba(0, 0, 0, 0.5)",
    color: "#f8c971",
    textShadow: "0 0 8px #a259f7, 0 0 2px #ff00cc",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Press Start 2P', monospace",
    textTransform: "uppercase",
    padding: "0.75rem 1.25rem",
    fontSize: "1rem",
    display: "inline-block",
    marginTop: "0.8rem",
    textDecoration: "none",
    boxShadow: "0 0 18px #a259f7cc",
    transition:
      "transform 0.18s cubic-bezier(.4,2,.6,1), filter 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s cubic-bezier(.4,2,.6,1)",
    animation: "flickerPurple 2.8s infinite alternate",
    marginBottom: "0.75rem",
    width: "60%",
  }}
/>
        <button
          onClick={handleResetPassword}
          style={{
            backgroundColor: "#ff00cc",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            fontFamily: "'Press Start 2P', monospace",
            cursor: "pointer",
          }}
        >
          Send Reset Link
        </button>
        {message && <p style={{ color: "lime", marginTop: "1rem" }}>{message}</p>}
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        <p
          style={{ color: "#ccc", cursor: "pointer", marginTop: "1.5rem" }}
          onClick={() => navigate("/account")}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}

export default ForgetPassword;