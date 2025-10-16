import React from "react";
import SEOHead from "../components/SEOHead";
import { generatePageTitle, generatePageDescription, generateKeywords } from "../utils/seoUtils";

function About() {
  return (
    <div className="container no-top-pad">
      <SEOHead
        title={generatePageTitle('about')}
        description={generatePageDescription('about')}
        keywords={generateKeywords('about')}
        url="/about"
      />
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="bg-video" 
        preload="auto" 
        poster="/TODO-about-poster.jpg"
        onError={(e) => console.error('About video error:', e)}
        onLoadStart={() => console.log('About video loading...')}
        onCanPlay={() => console.log('About video can play')}
        onPlay={() => console.log('About video started playing')}
      >
        <source src="/about.mp4" type="video/mp4" />
      </video>

      <div className="header-bg">
          <h1 className="about-name">About Us</h1>
          </div>

      <div className="about-cards-container">
        <div className="about-card">
          <h2 className="about-header">Meet the Creator</h2>
          <img src="/founder.jpeg" alt="Premium Tier" className="creator-img" />
          <p className="about-info">
           Created by Chris Shina, frontend developer and digital art lover.
 Retronix blends code, creativity, and nostalgia to create one-of-a-kind retro experiences.
          </p>
        </div>

        <div className="about-card">
          <h2 className="about-header">Why Retronix Exists?</h2>
          <p className="about-info">
            We believe your screen should feel alive, so Retronix was built to transform digital spaces to great aesthetics.
          </p>
        </div>

        <div className="about-card">
          <h2 className="about-header">Explore the Experience!</h2>
          <p className="about-info">
            Retronix delivers an ever-growing collection of static and live wallpapers inspired by retro dreams and neon worlds. Each drop is handcrafted or curated with a focus on aesthetic immersion.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;