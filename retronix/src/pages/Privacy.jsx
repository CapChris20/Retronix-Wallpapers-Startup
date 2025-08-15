// === src/pages/Privacy.jsx ===
import React from "react";

function Privacy() {
  return (
    <div className="privacy-bg-wrapper">
      <div className="privacy-page container no-top-pad">
        <div className="header-bg">
          <h1 className="about-name">Our Privacy Policies</h1>
        </div>

        <div className="privacy-cards-container">
          <div className="privacy-card">
            <h2 className="privacy-header">Introduction</h2>
            <p className="privacy-info">
              Retronix (“we”, “us”, or “our”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our website, services, or apps. By using Retronix, you consent to the practices described below.
            </p>
          </div>

          <div className="privacy-card">
            <h2 className="privacy-header">Information We Collect</h2>
            <ol className="privacy-info list-style">
              <li><strong>Account Information:</strong> Email, username, and login data (e.g., Google or Discord).</li>
              <li><strong>Payment Info:</strong> Subscription data via Stripe. We never store full card numbers.</li>
              <li><strong>Usage Data:</strong> Wallpaper views, downloads, and interaction metrics.</li>
              <li><strong>Device Info:</strong> Browser, OS, and IP address for analytics + security.</li>
            </ol>
          </div>

          <div className="privacy-card">
            <h2 className="privacy-header">How We Use Your Info</h2>
            <p className="privacy-info">
              We use your info to provide access to wallpapers, manage subscriptions, improve the platform, and communicate essential account updates.
            </p>
          </div>

          <div className="privacy-card">
            <h2 className="privacy-header">Third-Party Services</h2>
            <p className="privacy-info">
              We use trusted platforms like Firebase (auth/database), Stripe (payments), and Supabase (media hosting). These services only receive data necessary for functionality.
            </p>
          </div>

          <div className="privacy-card">
            <h2 className="privacy-header">Data Security</h2>
            <p className="privacy-info">
              We use secure encryption, authentication checks, and best practices to protect your data. While no system is 100% hack-proof, we prioritize safety at every level.
            </p>
          </div>

          <div className="privacy-card">
            <h2 className="privacy-header">Data Retention</h2>
            <p className="privacy-info">
              Your data is stored only as long as needed for platform operations or legal reasons. You can request account and data deletion at any time.
            </p>
          </div>

          <div className="privacy-card">
            <h2 className="privacy-header">International Users</h2>
            <p className="privacy-info">
              Retronix is based in the U.S. If you're using our services internationally, your data will be processed under U.S. laws and protections.
            </p>
          </div>

          <div className="privacy-card">
            <h2 className="privacy-header">Your Rights</h2>
            <ol className="privacy-info list-style">
              <li>Access or update your personal info</li>
              <li>Delete your account/data</li>
              <li>Request a copy of stored data</li>
              <li>Control non-essential notifications</li>
            </ol>
          </div>

          <div className="privacy-card">
            <h2 className="privacy-header">Policy Updates</h2>
            <p className="privacy-info">
              We may update this Privacy Policy occasionally. You'll see a "last updated" date, and important changes will be clearly communicated.
            </p>
          </div>

          <div className="privacy-card">
            <h2 className="privacy-header">Contact Us</h2>
            <p className="privacy-info">
              Have questions about your data or this policy? Contact us anytime at: <br /><strong>support@retronix.app</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;