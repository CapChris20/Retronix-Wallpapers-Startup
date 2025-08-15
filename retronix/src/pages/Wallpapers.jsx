// src/pages/Wallpapers.jsx

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db, provider } from "../firebase/firebase";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";

import StaticGrid from "../components/StaticGrid";
import LiveGrid from "../components/LiveGrid";
import PremiumGrid from "../components/PremiumGrid";
import Instructions from "../pages/Instructions";
import WallpaperGridHeader from "../components/WallpaperGridHeader";
import React from "react";

function Wallpapers() {
  const [tier, setTier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("live");
  const navigate = useNavigate();
  console.log("the user's tier is", tier );

  // Shared style for both controls
  const controlStyle = {
    height: '64px',
    padding: '0 2.5rem',
    borderRadius: '20px',
    fontFamily: "'Press Start 2P', monospace",
    background: '#1a0025',
    color: '#fff',
    textDecoration: 'none',
    boxShadow: '0 0 8px #ff00cc, 0 0 16px #00fff7',
    textAlign: 'center',
    border: '2.5px solid #ff00cc',
    textShadow: '0 0 4px #ff00cc',
    fontSize: '2rem',
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    outline: 'none',
    minWidth: '320px',
    maxWidth: '600px',
    justifyContent: 'center',
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("❌ No user. Attempting auto-login...");
        try {
          await signInWithPopup(auth, provider);
          console.log("✅ Auto-login successful. Rechecking access...");
          return;
        } catch (err) {
          console.error("❌ Auto-login failed. Redirecting...");
          navigate("/pricing");
          return;
        }
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          console.warn("⚠️ User doc missing. Redirecting...");
          navigate("/pricing");
          return;
        }

        const data = snap.data();
        console.log("🧪 Firestore user data:", data);

        const rawTier = data.tier || data.subscriptionTier || "Free";
        const normalized = rawTier.trim().toLowerCase();
        const allowed = ["static pro", "live pro", "premium pro"];

        if (!allowed.includes(normalized)) {
          console.warn("🚫 Access not valid yet. Redirecting to pricing...");
          navigate("/pricing");
          return;
        } else {
          setTier(rawTier);
          console.log("✅ Access granted:", rawTier);
        }
      } catch (err) {
        console.error("❌ Firestore error:", err);
        navigate("/pricing");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <div className="loading">Checking subscription...</div>;

  return (
    <div
      className="wallpapers-page responsive-wallpapers-layout"
      style={{
        minHeight: '100vh',
        padding: '0',
        width: '100vw',
        backgroundImage: "url('/wp-gridbg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* HEADER */}
      <div className="header-bg" style={{ width: '100%', zIndex: 10, position: 'relative', margin: 0, padding: 0, marginTop: '3.5rem' }}>
        <WallpaperGridHeader
          title="Your Wallpaper Grid"
          fixedHeader={false}
        />
      </div>

      {/* CONTROLS BAR */}
      <div
        className="wallpapers-controls-bar"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          margin: '1.5rem 0 2.5rem 0',
          zIndex: 5,
          position: 'relative',
          flexWrap: 'wrap',
        }}
      >
        <Link
          to="/instructions"
          className="view-more-button how-to-btn"
          style={controlStyle}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          HOW TO SET UP
        </Link>

        {tier === "Premium Pro" && (
          <select
            value={filter}
            onChange={e => {
              setFilter(e.target.value);
              e.target.blur(); // Remove focus so arrow keys scroll the page
            }}
            style={{
              ...controlStyle,
              paddingRight: '3.5rem', // extra space for dropdown arrow
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
            }}
          >
            <option value="live">Live Only</option>
            <option value="static">Static Only</option>
          </select>
        )}
      </div>

      {/* GRID */}
      <div className="wallpapers-controls-and-grid" style={{ width: '100%', margin: 0, padding: 0, zIndex: 1 }}>
        {tier === "Static Pro" && filter === "static" && <StaticGrid />}
        {tier === "Live Pro" && filter === "live" && <LiveGrid />}
        {tier === "Premium Pro" && <PremiumGrid filter={filter} />}
        {tier === "Free" && <Instructions />}
      </div>
    </div>
  );
}

export default Wallpapers;