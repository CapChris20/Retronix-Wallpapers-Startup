// Import React and two hooks:
// - useState: lets us store and update time left
// - useEffect: lets us run logic when the component mounts (start timer)
import React, { useState, useEffect } from 'react';


// Get the next Sunday at exactly 12:00am
function getNextSundayMidnight() {
  const now = new Date(); // Get the current date and time
  const next = new Date(now); // Clone the current time into a new object
  const daysUntilSunday = (7 - now.getDay()) % 7; // How many days left until Sunday (0 = Sunday, 6 = Saturday)
  next.setDate(now.getDate() + daysUntilSunday); // Move to the next Sunday
  next.setHours(0, 0, 0, 0); // Set time to exactly midnight (00:00:00)

  // If today is Sunday but it's already past midnight, skip to next week's Sunday
  if (daysUntilSunday === 0 && now > next) {
    next.setDate(next.getDate() + 7);
  }

  return next; // Return the next Sunday at midnight
}

// Calculate how much time is left until next Sunday at midnight
function getTimeLeft() {
  const now = new Date(); // Get current time
  const nextUpdate = getNextSundayMidnight(); // Get next target date (Sunday midnight)
  const diff = nextUpdate - now; // Difference in milliseconds
  const totalSeconds = Math.max(0, Math.floor(diff / 1000)); // Convert to seconds and prevent negatives

  // Break total seconds down into days, hours, minutes, seconds
  const days = Math.floor(totalSeconds / (24 * 3600)); // 1 day = 86400 seconds
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Return a time object
  return { days, hours, minutes, seconds };
}

// Main CountdownTimer React component
const CountdownTimer = () => {
  // Store the current time left in state
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  // When the component mounts, start a 1-second interval timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft()); // Every second, update the time left
    }, 1000);

    // When the component unmounts, stop the timer to prevent memory leaks
    return () => clearInterval(timer);
  }, []);

  // Render the countdown in a styled div
  return (
    <div className='header-bg'>
      <div className="countdown-timer">
        {/* Dynamically show time left with labels */}
        Next Update In: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </div>
    </div>
  );
};

// Export this component so you can use it in other files
export default CountdownTimer;