import React from "react";
import SEOHead from "../components/SEOHead";
import { generatePageTitle, generatePageDescription, generateKeywords } from "../utils/seoUtils";

function Contact() {
  return (
    <div
      className="container no-top-pad"
      style={{
        minHeight: "100vh",
        position: "relative",
        zIndex: 2,
        paddingTop: 0,
        marginTop: 0,
        paddingBottom: "4rem",
        textAlign: "center",
        display: "block"
      }}
    >
      <SEOHead
        title={generatePageTitle('contact')}
        description={generatePageDescription('contact')}
        keywords={generateKeywords('contact')}
        url="/contact"
      />
      <video autoPlay loop muted playsInline className="bg-video" preload="auto" poster="/TODO-contact-poster.jpg">
        <source src="/contact.mp4" type="video/mp4" />
      </video>

      <div className="header-bg" style={{ marginTop: 0, paddingTop: 0 }}>
        <h1 className="contact-name" style={{ margin: 0 }}>
          Contact Us
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div className="contact-content">
          <div className="contact-info">
            <p className="moreinfo">
              Need faster help? DM us on{" "}
              <a
                href="https://www.instagram.com/captain20chris/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </p>
            <p className="moreinfo">
              Or check out our <a href="/faq">FAQ page</a> first.
            </p>
            <p className="moreinfo">
              Email us directly:{" "}
              <a href="mailto:retronixwallpapers@gmail.com">
                retronixwallpapers@gmail.com
              </a>
            </p>

            <a
              href="https://mail.google.com/mail/?view=cm&to=retronixwallpapers@gmail.com&su=Help%20Request&body=Hello,%20I%20need%20assistance%20with..."
              target="_blank"
              rel="noopener noreferrer"
              className="send-message-btn"
              style={{ display: "inline-block", marginTop: "1.5rem" }}
            >
              Send Message
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;