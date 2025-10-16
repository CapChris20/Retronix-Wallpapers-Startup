// Home.jsx (fully explained for your deep Retronix learning)

import { useNavigate } from "react-router-dom"; /* Import useNavigate hook from react-router-dom to programmatically navigate to other routes */
import { useEffect, useState } from "react"; /* Import useEffect and useState hooks from React for lifecycle and state management */
import { ChevronDown } from "lucide-react"; /* Import ChevronDown icon component from lucide-react */
import CountdownTimer from '../components/CountdownTimer'; /* Import CountdownTimer component for countdown functionality */
import WallpaperCard from '../components/WallpaperCard'; /* Import WallpaperCard component to display wallpaper cards */
import SEOHead from '../components/SEOHead'; /* Import SEOHead component for SEO optimization */
import { generateHomepageStructuredData, generatePageTitle, generatePageDescription, generateKeywords } from '../utils/seoUtils'; /* Import SEO utilities */
import React from 'react';

function Home() { /* Declare the Home component */
  const navigate = useNavigate(); /* Create navigate function using useNavigate for routing */

  const [staticWallpapers, setStaticWallpapers] = useState([]); /* State: stores fetched static wallpapers as an array, initially empty */
  const [hideScrollHeader, setHideScrollHeader] = useState(false); /* State: controls visibility of scroll header, initially visible (false) */
  
  // Gaza Aid Pledge state - real data from Firebase function
  const [subscriptionsCollected, setSubscriptionsCollected] = useState(0); /* Real state: subscription revenue collected this month */
  const [nextDonationAmount, setNextDonationAmount] = useState(0); /* Real state: donation amount for this month */

  useEffect(() => { /* Run this effect on component mount */
    const now = Date.now(); /* Get current timestamp in ms */
    const msInAWeek = 7 * 24 * 60 * 60 * 1000; /* Calculate milliseconds in one week */
    const firstMonday = new Date("2024-01-01T00:00:00Z").getTime(); /* Get timestamp for Jan 1, 2024 */
    const weeksSince = Math.floor((now - firstMonday) / msInAWeek); /* Calculate the number of weeks since Jan 1, 2024 */
    const seed = weeksSince; /* Use weeksSince as the seed for deterministic shuffle */

    fetch("/static_wallpapers.json") /* Fetch static wallpapers JSON from public folder */
      .then((res) => res.json()) /* Parse JSON response */
      .then((data) => {
        const filtered = data
          .filter((wp) => wp.tier === "Free" || !wp.tier) /* Only include free wallpapers or those with no tier */
          .filter((wp) => wp.title !== ".DS_Store"); /* Exclude system .DS_Store files */

        const seededShuffle = (arr, seed) => { /* Function to shuffle array deterministically using seed */
          const rng = (s) => {
            let x = Math.sin(s) * 10000; /* Generate pseudo-random value based on sine */
            return x - Math.floor(x); /* Return decimal portion */
          };
          const newArr = [...arr]; /* Clone the array */
          for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(rng(seed + i) * (i + 1)); /* Determine swap index deterministically */
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]]; /* Swap elements */
          }
          return newArr; /* Return shuffled array */
        };

        const shuffled = seededShuffle(filtered, seed); /* Shuffle wallpapers consistently across users */
        setStaticWallpapers(shuffled.slice(0, 3)); /* Set state to first 3 shuffled wallpapers for preview */
      })
      .catch((err) => console.error("❌ JSON Fetch Error:", err)); /* Log fetch error */

    const handleScroll = () => { /* Function to handle scroll event */
      if (window.scrollY > 50) { /* If scrolled down more than 50px */
        setHideScrollHeader(true); /* Hide scroll header */
      } else {
        setHideScrollHeader(false); /* Show scroll header */
      }
    };
    window.addEventListener('scroll', handleScroll); /* Add scroll listener */
    return () => window.removeEventListener('scroll', handleScroll); /* Cleanup listener on unmount */

  }, []); /* Empty dependency array to run effect only once on mount */

  // Fetch monthly donation data from Firebase function
  useEffect(() => {
    const fetchMonthlyDonations = async () => {
      try {
        const response = await fetch('https://us-central1-retronix-auth.cloudfunctions.net/api/monthly-donations');
        const data = await response.json();
        
        if (data.success) {
          setSubscriptionsCollected(data.totalRevenue);
          setNextDonationAmount(data.totalDonations);
          console.log(`📊 Monthly data loaded: $${data.totalRevenue} revenue, $${data.totalDonations} donations`);
        } else {
          console.error('❌ Failed to fetch monthly donations:', data.error);
        }
      } catch (error) {
        console.error('❌ Error fetching monthly donations:', error);
      }
    };

    fetchMonthlyDonations();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchMonthlyDonations, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page"> {/* Main container with home-page styling */}
      <SEOHead
        title={generatePageTitle('home')}
        description={generatePageDescription('home')}
        keywords={generateKeywords('home')}
        structuredData={generateHomepageStructuredData()}
        url="/"
      />
      <video autoPlay loop muted playsInline className="bg-video" preload="metadata" poster="/TODO-home-poster.jpg"> {/* Background looping video */}
        <source src="/homepage.mp4" type="video/mp4" /> {/* Video source */}
        <track kind="descriptions" srcLang="en" label="English" /> {/* Accessibility track */}
      </video>

      <div className="hero"> {/* Hero section with title and slogan */}
        <h1 className="brand-name">RETRONIX</h1> {/* Main brand title */}
        <p className="slogan"> 4K Retro & Vaporwave Backgrounds! All one grid.</p> {/* Brand slogan */}

        <div
          className="scroll-icon" /* Container for scroll icon */
          onClick={() => { /* On click, scroll down smoothly to wallpaper preview section */
            const section = document.querySelector(".wallpaper-preview-section"); /* Find target section */
            section?.scrollIntoView({ behavior: "smooth" }); /* Smooth scroll into view */
          }}
          style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }} /* Centered column with pointer cursor */
        >
          {!hideScrollHeader && ( /* Only show header if not hidden on scroll */
            <h2 className="scroll-header" style={{ fontSize: "1rem", margin: "0.25rem 0", color: "#ff99cc", textShadow: "1px 1px #bf00ff" }}> Click Arrow for More</h2>
          )}
          <ChevronDown className="bounce" size={65} color="cyan" /> {/* Down arrow icon with bounce animation */}
        </div>
      </div>

      {/* Gaza Aid Pledge Section */}
      <div 
        className="gaza-aid-pledge-section"
        style={{
          margin: '2rem auto',
          maxWidth: '800px',
          padding: '2rem',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          border: '2px solid #ff00cc',
          borderRadius: '15px',
          boxShadow: '0 0 20px rgba(255, 0, 204, 0.3), 0 0 40px rgba(0, 255, 247, 0.2)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 5
        }}
      >
        <h2 
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            backgroundImage: 'linear-gradient(-225deg, #17bcda 0%, #682da7 29%, #eb13ff 67%, #a600ff90 100%)',
            backgroundSize: '200% auto',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none',
            marginBottom: '1.5rem',
            padding: '0.2rem 1rem',
            animation: 'textclip 2s linear infinite',
            transition: 'transform 0.2s ease',
            zIndex: 10,
            display: 'block',
            width: '100%',
            textAlign: 'center',
            fontFamily: "'Press Start 2P', monospace"
          }}
        >
          Retronix Gaza Aid Pledge
        </h2>
        
        <div 
          style={{
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: 'rgb(248, 201, 113)',
            marginBottom: '2rem',
            textAlign: 'center'
          }}
        >
          <p style={{ 
            marginBottom: '1rem',
            fontFamily: "'Press Start 2P', monospace",
            letterSpacing: '0.6px',
            textShadow:
              '1px 1px rgb(208, 28, 154),\
               1px 2px rgb(208, 28, 154),\
               1px 3px rgb(208, 28, 154),\
               1px 4px rgb(208, 28, 154),\
               1px 5px rgb(208, 28, 154),\
               1px 6px rgb(208, 28, 154)'
          }}>
            We believe that the creative work of Retronix should help people in need. That's why 100% of subscription revenue will be donated monthly to a trusted humanitarian organization supporting civilians in Gaza.
          </p>
          <p style={{ 
            marginBottom: '1rem',
            fontFamily: "'Press Start 2P', monospace",
            letterSpacing: '0.6px',
            textShadow:
              '1px 1px rgb(208, 28, 154),\
               1px 2px rgb(208, 28, 154),\
               1px 3px rgb(208, 28, 154),\
               1px 4px rgb(208, 28, 154),\
               1px 5px rgb(208, 28, 154),\
               1px 6px rgb(208, 28, 154)'
          }}>
            Donations will be made every month, and proof of each donation (receipt screenshots) will be posted here for full transparency.
          </p>
          <p style={{ 
            fontFamily: "'Press Start 2P', monospace",
            letterSpacing: '0.6px',
            textShadow:
              '1px 1px rgb(208, 28, 154),\
               1px 2px rgb(208, 28, 154),\
               1px 3px rgb(208, 28, 154),\
               1px 4px rgb(208, 28, 154),\
               1px 5px rgb(208, 28, 154),\
               1px 6px rgb(208, 28, 154)'
          }}>
            Until subscriptions begin, this page documents our pledge and the process to ensure all funds reach those in need.
          </p>
        </div>

        {/* Donation Counter */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
            marginTop: '1.5rem'
          }}
        >
          <div 
            style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: '#00fff7',
              textShadow: '0 0 5px #00fff7',
              fontFamily: "'Press Start 2P', monospace"
            }}
          >
            Subscriptions Collected This Month: ${subscriptionsCollected.toFixed(2)}
          </div>
          <div 
            style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: '#ff99cc',
              textShadow: '0 0 5px #ff99cc',
              fontFamily: "'Press Start 2P', monospace"
            }}
          >
            Next Donation Amount: ${nextDonationAmount.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="wallpaper-preview-section"> {/* Section for wallpaper previews */}
        <div className="header-bg">
          <h2 className="preview-title">Explore Free Wallpapers (Free Tier)</h2> {/* Section title */}
        </div>
        <CountdownTimer /> {/* Countdown timer for releases */}
        <div className="wallpaper-grid--centered"> {/* Grid container for wallpaper previews */}
          {staticWallpapers.map((wp, index) => ( /* Map over staticWallpapers to render each WallpaperCard */
            <WallpaperCard
              key={`${wp.title}-${index}`} /* Key for React re-rendering */
              wallpaper={wp} /* Pass wallpaper data as prop to WallpaperCard */
              compact={true}
            />
          ))}
        </div>
        <button
          className="view-more-button" /* Styled button */
          onClick={() => navigate("/wallpapers")} /* Navigate to /wallpapers on click */
        >
          View All Wallpapers {/* Button text */}
        </button>
      </div>
    </div>
  );
}

export default Home; /* Export Home component for use in routing */