// Home.jsx (fully explained for your deep Retronix learning)

import { useNavigate } from "react-router-dom"; /* Import useNavigate hook from react-router-dom to programmatically navigate to other routes */
import { useEffect, useState } from "react"; /* Import useEffect and useState hooks from React for lifecycle and state management */
import { ChevronDown } from "lucide-react"; /* Import ChevronDown icon component from lucide-react */
import CountdownTimer from '../components/CountdownTimer'; /* Import CountdownTimer component for countdown functionality */
import WallpaperCard from '../components/WallpaperCard'; /* Import WallpaperCard component to display wallpaper cards */
import React from 'react';

function Home() { /* Declare the Home component */
  const navigate = useNavigate(); /* Create navigate function using useNavigate for routing */

  const [staticWallpapers, setStaticWallpapers] = useState([]); /* State: stores fetched static wallpapers as an array, initially empty */
  const [hideScrollHeader, setHideScrollHeader] = useState(false); /* State: controls visibility of scroll header, initially visible (false) */

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

  return (
    <div className="home-page"> {/* Main container with home-page styling */}
      <video autoPlay loop muted playsInline className="bg-video" preload="none" poster="/TODO-home-poster.jpg"> {/* Background looping video */}
        <source src="/homepage.mp4" type="video/mp4" /> {/* Video source */}
      </video>

      <div className="hero"> {/* Hero section with title and slogan */}
        <h1 className="brand-name">RETRONIX</h1> {/* Main brand title */}

        <p className="slogan">Static visions. Live realities. All one grid.</p> {/* Brand slogan */}

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