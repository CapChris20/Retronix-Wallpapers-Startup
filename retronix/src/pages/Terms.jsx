
// === src/pages/Terms.jsx ===
import React from "react";
import SEOHead from "../components/SEOHead";
import { generatePageTitle, generatePageDescription, generateKeywords } from "../utils/seoUtils";

function Terms() {
  return (
    <div className="terms-bg-wrapper">
      <SEOHead
        title={generatePageTitle('terms')}
        description={generatePageDescription('terms')}
        keywords={generateKeywords('terms')}
        url="/terms"
      />
      <div className="terms-page container no-top-pad">
        <div className="header-bg">
          <h1 className="about-name">Terms of Service</h1>
        </div>

        <div className="terms-cards-container">
          <div className="terms-card">
            <h2 className="terms-header">Acceptance of Terms</h2>
            <p className="terms-info">By accessing or using Retronix ("the Service"), you acknowledge that you have read, understood, and agreed to these Terms of Service. If you do not agree with any part of these terms, you must discontinue your use of the Service immediately. These Terms may be updated from time to time, and your continued use of the Service after updates are published will constitute acceptance of the revised Terms.</p>
          </div>

          <div className="terms-card">
            <h2 className="terms-header">Eligibility and Account Responsibilities</h2>
            <p className="terms-info">You must be at least 13 years of age or the legal minimum age in your jurisdiction to use Retronix. You are solely responsible for safeguarding your account credentials and all activity conducted under your account. You agree to promptly notify us of any unauthorized use of your account or any breach of security. Retronix cannot and will not be liable for any loss or damage arising from your failure to comply with this obligation.</p>
          </div>

          <div className="terms-card">
            <h2 className="terms-header">Subscriptions, Payments, and Billing</h2>
            <p className="terms-info">Premium access to Retronix features requires a valid subscription. Payments are processed securely through Stripe and may require you to provide personal and financial information. Payments are final and non-refundable except as required by law. If you cancel a subscription before the end of the billing period, you will retain access to Premium features until the period expires. Retronix reserves the right to change subscription pricing with 30 days' notice.</p>
          </div>

          <div className="terms-card">
            <h2 className="terms-header">Content License and Usage Rights</h2>
            <p className="terms-info">Retronix grants you a limited, non-exclusive, non-transferable license to download and use wallpapers for personal, non-commercial purposes only. Redistribution, resale, modification, or public display of any Retronix content is strictly prohibited without our explicit prior consent. All content is either owned by Retronix or licensed to Retronix, and we retain all rights not expressly granted to you under this agreement.</p>
          </div>

          <div className="terms-card">
            <h2 className="terms-header">Prohibited Conduct</h2>
            <ol className="terms-info list-style">
              <li><strong>Violate</strong> any applicable laws or regulations.</li>
              <li><strong>Disrupt</strong>, damage, or gain unauthorized access to Retronix or its infrastructure.</li>
              <li><strong>Scrape</strong>, crawl, or automate access to content without permission.</li>
              <li><strong>Upload</strong> or share harmful, illegal, or infringing material. Violations of these prohibitions may result in account termination, removal of content, and/or legal action.</li>
            </ol>
          </div>

          <div className="terms-card">
            <h2 className="terms-header">Intellectual Property</h2>
            <p className="terms-info">The design, logos, artwork, and other creative materials found on Retronix are protected by copyright, trademark, and other laws. Except as permitted by these Terms, you may not reproduce, distribute, prepare derivative works, or publicly display any part of our Service without prior written authorization.</p>
          </div>

          <div className="terms-card">
            <h2 className="terms-header">Account Suspension and Termination</h2>
            <p className="terms-info">We reserve the right to suspend, restrict, or terminate your account at any time if you breach these Terms or engage in any behavior that Retronix deems harmful or inappropriate. In the event of termination, you will lose access to all paid features without any right to a refund.</p>
          </div>

          <div className="terms-card">
            <h2 className="terms-header">Disclaimer of Warranties</h2>
            <p className="terms-info">Retronix is provided on an "as-is" and "as-available" basis without warranties of any kind. To the fullest extent permitted by law, we disclaim all warranties, express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or free of harmful components.</p>
          </div>

          <div className="terms-card">
            <h2 className="terms-header">Limitation of Liability</h2>
            <p className="terms-info">To the maximum extent permitted by law, Retronix and its affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of your use of or inability to use the Service. This limitation applies regardless of the theory of liability and even if we have been advised of the possibility of such damages.</p>
          </div>

          <div className="terms-card">
            <h2 className="terms-header">Changes to Terms</h2>
            <p className="terms-info">We may revise these Terms at any time. Changes will be posted on this page, and the "Last Updated" date will reflect the most recent revision. Continued use of the Service after changes indicates your acceptance of those revised Terms. Please review these Terms periodically to stay informed.</p>
          </div>

          <div className="terms-card">
            <h2 className="terms-header">Contact Us</h2>
            <p className="terms-info">If you have questions, concerns, or need help related to these Terms of Service, you may contact us at our Contact Us page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terms;
