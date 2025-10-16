// Utility functions for video handling

/**
 * Check if a video URL is accessible
 * @param {string} url - The video URL to check
 * @returns {Promise<boolean>} - True if accessible, false otherwise
 */
export const checkVideoAccessibility = async (url) => {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Get the best available video URL from a list of options
 * @param {Array<string>} urls - Array of video URLs to try
 * @returns {Promise<string|null>} - The first working URL or null if none work
 */
export const getBestVideoUrl = async (urls) => {
  if (!urls || urls.length === 0) return null;
  
  // Filter out obviously broken URLs first
  const validUrls = urls.filter(url => {
    if (!url) return false;
    // Skip R2 URLs that are known to be broken
    if (url.includes('r2.dev')) return false;
    // Skip retronixwallpapers.com URLs that redirect to R2
    if (url.includes('retronixwallpapers.com/wallpaper.html') && url.includes('r2.dev')) return false;
    return true;
  });
  
  if (validUrls.length === 0) return null;
  
  // Try each URL in order until we find one that works
  for (const url of validUrls) {
    if (await checkVideoAccessibility(url)) {
      return url;
    }
  }
  
  return null;
};

/**
 * Create a video element with proper error handling
 * @param {string} src - Video source URL
 * @param {Object} options - Video options
 * @returns {HTMLVideoElement} - Configured video element
 */
export const createVideoElement = (src, options = {}) => {
  const video = document.createElement('video');
  
  // Set default attributes
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.loading = 'lazy';
  
  // Apply custom options
  Object.assign(video, options);
  
  // Set source
  video.src = src;
  
  return video;
};

/**
 * Handle video loading errors gracefully
 * @param {Event} errorEvent - The error event
 * @param {Function} onError - Callback function for error handling
 */
export const handleVideoError = (errorEvent, onError) => {
  const video = errorEvent.target;
  const src = video.src;
  
  // Only log in development to avoid console spam
  if (process.env.NODE_ENV === 'development') {
    console.log('Video failed to load:', src);
  }
  
  if (onError && typeof onError === 'function') {
    onError(errorEvent);
  }
};
