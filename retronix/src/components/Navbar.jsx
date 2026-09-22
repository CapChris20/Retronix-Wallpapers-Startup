import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on link click (mobile)
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav className="retronix-navbar" aria-label="Main navigation">
      <div className="retronix-navbar-inner">
        <Link to="/" className="nav-brand" onClick={handleLinkClick}>RETRONIX<span>WALLPAPERS</span></Link>
        {/* Hamburger for mobile */}
        <button
          className={`retronix-hamburger${menuOpen ? ' open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="retronix-navbar-links"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        {/* Nav links */}
        <div
          className={`retronix-navbar-links${menuOpen ? ' open' : ''}`}
          id="retronix-navbar-links"
        >
          <Link
            to="/"
            className={`retronix-nav-link${location.pathname === '/' ? ' active' : ''}`}
            onClick={handleLinkClick}
          >
            Home
          </Link>
          <Link to="/wallpapers" className={`retronix-nav-link${location.pathname === "/wallpapers" ? " active" : ""}`} onClick={handleLinkClick}>Wallpapers</Link>
          <Link
            to="/about"
            className={`retronix-nav-link${location.pathname === '/about' ? ' active' : ''}`}
            onClick={handleLinkClick}
          >
            About
          </Link>
          <Link
            to="/faq"
            className={`retronix-nav-link${location.pathname === '/faq' ? ' active' : ''}`}
            onClick={handleLinkClick}
          >
            FAQs
          </Link>
          <Link
            to="/login"
            className={`retronix-nav-link${location.pathname === '/login' ? ' active' : ''}`}
            onClick={handleLinkClick}
          >
            Account
          </Link>
          <Link
            to="/contact"
            className={`retronix-nav-link${location.pathname === '/contact' ? ' active' : ''}`}
            onClick={handleLinkClick}
          >
            Contact Us
          </Link>
          <Link
            to="/pricing"
            className={`retronix-nav-link${location.pathname === '/pricing' ? ' active' : ''}`}
            onClick={handleLinkClick}
          >
            Pricing
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;