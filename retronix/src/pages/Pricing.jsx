// Pricing.jsx deeply explained with non-vague, line-by-line inline comments for your Retronix learning

import { useState, useEffect } from "react"; // imports React hooks for state and lifecycle handling
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase authentication imports to monitor login state
import { db } from "../firebase/firebase"; // import initialized Firestore database
import { doc, getDoc } from "firebase/firestore"; // Firestore document methods for reading user tier data
import ConfirmModal from '../components/ConfirmModal'; // import your reusable modal componentimport React from "react";
import React from "react";

function Pricing() { // functional React component named Pricing
  const [loading, setLoading] = useState(false); // state to track loading while subscribing
  const [uid, setUid] = useState(null); // state to hold the logged-in user's UID if available
  const [modalOpen, setModalOpen] = useState(false); // controls visibility of ConfirmModal
  const [modalMsg, setModalMsg] = useState(""); // message content inside ConfirmModal

  useEffect(() => { // runs once on component mount to check auth state
    const auth = getAuth(); // get the Firebase Auth instance
    const unsubscribe = onAuthStateChanged(auth, (user) => { // listener for auth state changes
      if (user) { // if a user is logged in
        setUid(user.uid); // store the user UID in state
      } else {
        setUid(null); // clear UID if logged out
      }
    });
    return () => unsubscribe(); // cleanup the listener when component unmounts
  }, []);

  // function to handle subscribing to a tier
  const handleSubscribe = async (tier) => {
    if (!uid) { // if no user logged in
      setModalMsg("You must be logged in to subscribe."); // show modal with login message
      setModalOpen(true); // open the modal
      return; // stop further execution
      console.log("Purchasing tier:", tier)

    }

    setLoading(true); // indicate loading while processing subscription

    try {
      const userDoc = await getDoc(doc(db, "users", uid)); // get the user's Firestore document
      const userTier = userDoc.data()?.tier; // safely access the 'tier' field if exists
      if (userTier && userTier !== "none") { // if user already has an active subscription
        setModalMsg("You already have an active subscription. Please cancel it before purchasing another."); // inform user
        setModalOpen(true); // show modal
        setLoading(false); // stop loading
        return; // prevent re-purchasing
      }

      const response = await fetch("https://api-yxidj5clqa-uc.a.run.app/create-checkout-session", {
        method: "POST", // use POST to send subscription request
        headers: { "Content-Type": "application/json" }, // specify JSON headers
        body: JSON.stringify({ uid, tier }), // send uid and selected tier to backend
      });

      const data = await response.json(); // parse JSON response from backend
      console.log("📦 Stripe response:", data); // log response for debugging

      if (!data.url) throw new Error("No redirect URL returned."); // ensure URL exists before redirecting
      window.location.href = data.url; // redirect to Stripe checkout page
    } catch (error) { // catch errors during fetch
      console.error("🔥 Error during subscription:", error); // log error
      setModalMsg("Something went wrong. Please try again."); // inform user
      setModalOpen(true); // open modal to show error
    } finally {
      setLoading(false); // always stop loading regardless of success/failure
    }
  };

  return (
    <div className="pricing-page" style={{ paddingTop: '7rem' }}> {/* container for the pricing page with top padding for spacing */}
      <div className="header-bg"> {/* header background wrapper */}
        <h1 className="pricing-name"> Our Subscription Tiers</h1> {/* page title */}
      </div>

      <video autoPlay loop muted playsInline className="bg-video" preload="none" poster="/TODO-pricing-poster.jpg"> {/* background video */}
        <source src="/pricing.mp4" type="video/mp4" /> {/* video source */}
      </video>

      <div className="pricing-wrapper"> {/* wraps all pricing cards */}

        {/* FREE TIER CARD */}
        <div className="pricing-card">
          <div className="ribbon">FREE</div> {/* ribbon label */}
          <h1 className="sub-name">Free Tier</h1>
          <img src="/free.PNG" alt="Free Tier" className="pricing-img" />
          <ul className="pricing-bullets">
            <li>Access to 3 static wallpapers</li>
            <li>Randomization for the wallpapers changes every week</li>
            <li>No account needed</li>
            <li>NO subscription needed</li>
          </ul>
        </div>

        {/* STATIC PRO TIER CARD */}
        <div className="pricing-card">
          <div className="ribbon">STATIC</div>
          <h1 className="sub-name">Static Pro</h1>
          <img src="/static-pro.PNG" alt="Static Tier" className="pricing-img" />
          <h3 className="price">$2.99</h3>
          <h6 className="onetime">One time Sub</h6>
          <ul className="pricing-bullets">
            <li>Lifetime access to 250+ static wallpapers</li>
            <li>No recurring payments</li>
            <li>Full-res downloads unlocked</li>
            <li>Organized by category & theme</li>
            <li>Includes desktop & mobile sizes</li>
            <li>Early access to static-only drops</li>
          </ul>
          <button
            className="stripe-pay"
            onClick={() => handleSubscribe("Static Pro")} // calls handleSubscribe with "Static Pro" tier
            disabled={loading} // disables button if loading
          >
            {loading ? "Loading..." : "Subscribe Here"} 
          </button>
        </div>

        {/* LIVE PRO TIER CARD */}
        <div className="pricing-card">
          <div className="ribbon">LIVE</div>
          <h1 className="sub-name">Live Pro</h1>
          <img src="/live-pro.PNG" alt="Live Tier" className="pricing-img" />
          <h3 className="price">$4.99</h3>
          <h6 className="onetime">One time Sub</h6>
          <ul className="pricing-bullets">
            <li>Lifetime access to 350+ live wallpapers</li>
            <li>High-quality MP4 format</li>
            <li>Desktop compatible</li>
            <li>Handpicked vaporwave & retro loops</li>
            <li>New live drops added monthly</li>
            <li>Priority support for playback help</li>
          </ul>
          <button
            className="stripe-pay"
            onClick={() => handleSubscribe("Live Pro")} // calls handleSubscribe with "Live Pro" tier
            disabled={loading}
          >
            {loading ? "Loading..." : "Subscribe Here"}
          </button>
        </div>

        {/* PREMIUM PRO TIER CARD */}
        <div className="pricing-card">
          <div className="ribbon">PREMIUM</div>
          <h1 className="sub-name">Premium Pro</h1>
          <img src="/premium-pro.PNG" alt="Premium Tier" className="pricing-img" />
          <h3 className="price">$6.99</h3>
          <h6 className="onetime">One time Sub</h6>
          <ul className="pricing-bullets">
            <li>Unlock all static & live wallpapers</li>
            <li>Access to every future update</li>
            <li>Exclusive experimental content</li>
            <li>Ultimate Retronix experience</li>
          </ul>
          <button
            className="stripe-pay"
            onClick={() => handleSubscribe("Premium Pro")} // calls handleSubscribe with "Premium Pro" tier
            disabled={loading}
          >
            {loading ? "Loading..." : "Subscribe Here"}
          </button>
        </div>

      </div>

      {/* ConfirmModal for messages and errors */}
      <ConfirmModal
        open={modalOpen} // controls visibility
        onConfirm={() => setModalOpen(false)} // closes modal on confirm
        onCancel={null} // no cancel needed
      >
        {modalMsg} 
      </ConfirmModal>

    </div>
  );
}

export default Pricing; // export the component for use in your app