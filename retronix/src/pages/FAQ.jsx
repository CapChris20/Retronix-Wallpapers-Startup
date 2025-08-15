import React from 'react';


function FAQ() {
  return (
    <div className="container no-top-pad">

      <video autoPlay loop muted playsInline className="bg-video" preload="none" poster="/TODO-faq-poster.jpg">
        <source src="/faq.mp4" type="video/mp4" />
      </video>

      <div className="header-bg">
        <h1 className="faqs-name">Most Asked Questions</h1>
      </div>

      <div className="faqs-column">
        <div className="faqs-card">
          <div className="question">What is Retronix?</div>
          <div className="answer">
            Retronix is a wallpaper subscription service designed to transform your screen into a retro-inspired dreamscape. It offers a growing collection of static and animated (MP4) wallpapers, all curated with a love for synth aesthetics, neon vibes, and nostalgic energy.
          </div>
        </div>

        <div className="faqs-card">
          <div className="question">What makes Retronix wallpapers different?</div>
          <div className="answer">
            Our wallpapers are more than just visuals—they're curated experiences. Each design is chosen or crafted to deliver a unique blend of retro color palettes, dynamic animations, and thematic storytelling. Whether it's a static image or a pulsating animated loop, every wallpaper is selected for its ability to evoke a sense of nostalgia and futuristic flair simultaneously.
          </div>
        </div>

        <div className="faqs-card">
          <div className="question">How do I access the wallpapers after purchase?</div>
          <div className="answer">
            After you complete your purchase or subscription signup, you'll gain instant access to the Retronix grid. From there, you can browse, preview, and download any wallpaper available to your tier. Everything is delivered in high quality, with no compression or watermarks — just pure visual fire.
          </div>
        </div>

        <div className="faqs-card">
          <div className="question">Do I need a subscription to get wallpapers?</div>
          <div className="answer">
            For free tier, no you don't. But to get live, static, and premium content, you need to subscribe — it will be a one-time subscription and not recurring. That means no auto-renewals, no surprise charges, just access for life after a single payment.
          </div>
        </div>

        <div className="faqs-card">
          <div className="question">Where are the wallpapers sourced from?</div>
          <div className="answer">
            We source most of our content from Envato Elements and AI-generated work from Hailou AI, a premium platform for high-quality visuals. All third-party wallpapers are legally licensed and curated to match the Retronix aesthetic. We deeply respect and credit the work of the original creators whose art helps shape the experience you see on this site.
          </div>
        </div>

        <div className="faqs-card">
          <div className="question">Can I use the wallpapers on any devices?</div>
          <div className="answer">
            For static wallpapers, yes — they can be used for laptops, phones, tablets, gaming consoles, etc. But for live wallpapers, desktop (Mac & Windows) and even smart TVs are the only devices supported. Mobile support for live wallpapers is planned but not currently available.
          </div>
        </div>

        <div className="faqs-card">
          <div className="question">How often do new wallpapers drop?</div>
          <div className="answer">
            We release new content on a monthly basis, sometimes faster. Pro tier users may also receive exclusive content or early access to drops. Every release is tailored to maintain a consistent aesthetic that aligns with our retro-futuristic vision.
          </div>
        </div>

        <div className="faqs-card">
          <div className="question">Do I need to cancel my subscription?</div>
          <div className="answer">
            No cancellation is needed. Retronix uses a one-time payment model, not a recurring subscription. Once you purchase a tier, you keep access for life — no auto-renewals, no hidden fees, and no surprises. Just buy once and enjoy.
          </div>
        </div>

        <div className="faqs-card">
          <div className="question">Do I need to credit Retronix if I share a wallpaper?</div>
          <div className="answer">
            No, but it's appreciated. If you're posting online or showcasing the wallpaper, tagging or crediting Retronix helps support the project and spread the retro vibe. It's never required, but we love to see the love.
          </div>
        </div>

        <div className="faqs-card">
          <div className="question">Can I use these wallpapers for commercial use?</div>
          <div className="answer">
            Considering the content is from Envato Elements and Hailou AI, no. Retronix wallpapers are licensed for personal use only. You can't resell, redistribute, or use them in commercial branding, merch, or apps without permission.
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
