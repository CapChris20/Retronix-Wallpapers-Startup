// Account.jsx with **real, non-broad, line-by-line comments** for your deep understanding
import React from "react";
import { useEffect, useState } from "react"; // React hooks
import {
  signInWithPopup, // signs in with Google popup
  signOut, // signs out current user
  onAuthStateChanged, // listens for auth state changes
  createUserWithEmailAndPassword, // creates user with email/pass
  signInWithEmailAndPassword, // signs in with email/pass
  sendEmailVerification, // sends verification email
} from "firebase/auth";
import { auth, provider, db } from "../firebase/firebase"; // your Firebase config
import { useNavigate } from "react-router-dom"; // for page redirects
import { doc, setDoc, updateDoc } from "firebase/firestore"; // Firestore functions
import ConfirmModal from "../components/ConfirmModal"; // reusable modal

function Account() {
  const [user, setUser] = useState(null); // stores logged-in user object
  const [email, setEmail] = useState(""); // stores input email
  const [password, setPassword] = useState(""); // stores input password
  const [isLogin, setIsLogin] = useState(true); // toggle between login/signup
  const [error, setError] = useState(""); // error message string
  const [showConfirm, setShowConfirm] = useState(false); // confirm cancel subscription modal
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // confirm logout modal

  const navigate = useNavigate(); // navigate between pages

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider); // opens Google login popup
      await handleUserData(result.user); // process user data
    } catch (error) {
      console.error("❌ Google login failed:", error.message);
      setError(error.message);
    }
  };

  const handleEmailAuth = async () => {
    setError(""); // clear old errors
    try {
      const authFn = isLogin ? signInWithEmailAndPassword : createUserWithEmailAndPassword;
      const result = await authFn(auth, email, password); // sign in or sign up with email

      if (!isLogin) {
        await sendEmailVerification(result.user); // send verification if new account
        alert("Verification email sent! Check inbox.");
        await signOut(auth);
      } else {
        if (!result.user.emailVerified) {
          alert("Please verify your email before logging in.");
          await signOut(auth);
        } else {
          await handleUserData(result.user); // proceed if verified
        }
      }
    } catch (err) {
      console.error("❌ Email auth failed:", err.message);
      setError(err.message);
    }
  };

  const handleUserData = async (user) => {
    const userRef = doc(db, "users", user.uid); // reference user doc by UID
    await setDoc(
      userRef,
      {
        email: user.email, // store email
        name: user.displayName || "Anonymous", // store name
        subscription: "Free", // default free tier
      },
      { merge: true } // merge with existing data
    );
    console.log("✅ Auth successful:", user.email);
    navigate("/wallpapers"); // go to wallpapers
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // sign user out
      setUser(null); // clear user state
      console.log("✅ User logged out");
      setShowLogoutConfirm(false); // close modal
    } catch (err) {
      console.error("❌ Logout failed:", err.message);
      setError(err.message);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid), { tier: "none" }); // cancel tier
      alert("Your subscription has been canceled.");
      setShowConfirm(false);
    } catch (error) {
      alert("Failed to cancel subscription.");
      setShowConfirm(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (!currentUser.emailVerified) {
          alert("Please verify your email before accessing your account.");
          signOut(auth);
        } else {
          setUser(currentUser); // set user if verified
        }
      } else {
        setUser(null); // clear user if logged out
      }
    });
    return () => unsubscribe(); // cleanup listener
  }, []);

  return (
    <div className="account-page">
      {/* Background video with fallback poster */}
      <video autoPlay loop muted playsInline className="bg-video" preload="none" poster="/TODO-account-poster.jpg">
        <source src="/login - signup.mp4" type="video/mp4" />
      </video>

      {/* Card container */}
      <div className="account-card" style={{ textAlign: "center" }}>
        <h1 className="ac-info">Account and Info</h1>

        {/* If user is NOT logged in, show login/signup inputs */}
        {!user ? (
          <>
            {/* Email input */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
              style={{ margin: "0.5rem", padding: "0.5rem", width: "80%" }}
            />
            {/* Password input */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
              style={{ margin: "0.5rem", padding: "0.5rem", width: "80%" }}
            />
            {/* Show error message if exists */}
            {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

            {/* Login/signup buttons */}
            <button onClick={handleEmailAuth} className="email-login">
              {isLogin ? "Log In with Email" : "Sign Up with Email"}
            </button>
            <div style={{ margin: '1rem 0', color: '#ff99cc', fontFamily: "'Press Start 2P', monospace", fontSize: '1.1rem', textShadow: '0 0 8px #ff00cc', letterSpacing: '2px' }}>or</div>
            <button onClick={handleGoogleLogin} className="google-login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem', margin: '0.8rem auto' }}>
              <img src="/google-icon.png" alt="Google" style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem', background: 'white', borderRadius: '50%' }} />
              Log In with Google
            </button>

            {/* Toggle login/signup */}
            <p
              onClick={() => setIsLogin(!isLogin)}
              style={{ color: "#ff99cc", cursor: "pointer", marginTop: "1rem", textDecoration: "underline" }}
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
            </p>

            {/* Forgot password link */}
            <p
              style={{ color: "#ccc", cursor: "pointer", marginTop: "0.5rem", textDecoration: "underline" }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </p>
          </>
        ) : (
          <>
            {/* If logged in, greet user */}
            <p style={{ color: "#ff99cc", fontSize: "1.6rem", marginTop: "1.5rem", textShadow: "1px 1px rgb(208, 28, 154)" }}>
              Enjoy Retronix Wallpapers, {user.displayName || user.email}
            </p>

            {/* Logout and cancel subscription buttons */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", marginTop: "1rem" }}>
              <button onClick={() => setShowLogoutConfirm(true)} className="logout-btn">
                Logout
              </button>
              <button
                className="logout-btn"
                style={{ marginTop: "0.5rem", background: "linear-gradient(90deg, #ff00cc 0%, #2d006e 100%)" }}
                onClick={() => setShowConfirm(true)}
              >
                Cancel Subscription
              </button>
            </div>

<div style={{ margin: '1rem 0',  fontFamily: "'Press Start 2P', monospace",
  fontSize: "1.5rem",
  lineHeight: 1.7,
  textAlign: "center",
  padding: "1.2rem",
  marginTop: "0.5rem",
  background: "rgba(0, 0, 0, 0.65)",
  borderRadius: "10px",
  backgroundClip: "padding-box",
  border: "1.5px solid #ff00ff",
  boxShadow: "0 0 12px rgba(255, 0, 255, 0.5)",
  color: "#ff99cc",
  letterSpacing: "0.6px",
  textShadow: `
    1px 1px rgb(191, 0, 255),
    1px 2px rgb(191, 0, 255),
    1px 3px rgb(191, 0, 255),
    1px 4px rgb(191, 0, 255),
    1px 5px rgb(191, 0, 255),
    1px 6px rgb(191, 0, 255)
  `, }}>
  If you want to see your wallpaper grid, click button below!</div> 

              <button
          className="view-more-button" /* Styled button */
          onClick={() => navigate("/wallpapers")} /* Navigate to /wallpapers on click */
        >
         Your Wallpapers  {/* Button text */}
        </button>

            {/* Confirm modals for logout and cancel subscription */}
            <ConfirmModal open={showConfirm} onConfirm={handleCancelSubscription} onCancel={() => setShowConfirm(false)}>
              Are you sure you want to cancel your subscription?
            </ConfirmModal>

            <ConfirmModal open={showLogoutConfirm} onConfirm={handleLogout} onCancel={() => setShowLogoutConfirm(false)}>
              Are you sure you want to logout?
            </ConfirmModal>
          </>
        )}
      </div>
    </div>
  );
}

export default Account;