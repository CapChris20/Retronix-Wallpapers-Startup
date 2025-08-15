import React from 'react';


// Footer component for the site
function Footer(){
    return(
        // Footer HTML structure
<footer className="footer">
  <div className="footer-inner">
    {/* Brand name in the footer */}
    <h3 className="footer-brand">RETRONIX Wallpapers</h3>
    {/* Footer links for privacy and terms */}
    <div className="footer-links">
      <a href="/privacy" className="footer-link">Privacy Policy</a>
      <a href="/terms" className="footer-link">Terms of Service</a>
    </div>
    {/* Copyright notice */}
    <p className="footer-copy">© 2025 Retronix. All rights reserved.</p>
  </div>
</footer>
    );
}

export default Footer