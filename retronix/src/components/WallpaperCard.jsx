import React, { useRef, useState } from "react";
import { handleVideoError } from "../utils/videoUtils";
import { generateWallpaperAltText } from "../utils/seoUtils";

const fallbackImg = "/brand-logo.PNG"; // Use existing brand logo as fallback

const WallpaperCard = ({ wallpaper, compact }) => {
  const videoRef = useRef(null);
  const imgRef = useRef(null);
  
  // Debug log to help diagnose issues (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('WallpaperCard rendering:', wallpaper.title, 'thumbnail:', wallpaper.thumbnail);
  }

  // Clean the thumbnail URL by removing trailing backslashes and ensuring it's valid
  const cleanThumbnailUrl = (url) => {
    if (!url) return fallbackImg;
    const cleaned = url.replace(/\\+$/, '').trim();
    if (process.env.NODE_ENV === 'development') {
      console.log('Cleaned URL:', url, '->', cleaned);
    }
    return cleaned;
  };

  // imgSrc is initialized to thumbnail, thumb, or preview (in that order)
  const [imgSrc, setImgSrc] = React.useState(cleanThumbnailUrl(wallpaper.thumbnail || wallpaper.thumb || wallpaper.preview));

  // For Plash link copy feedback
  const [copied, setCopied] = useState(false);
  const handleCopyPlash = (plashUrl) => {
    navigator.clipboard.writeText(plashUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // Only show video if wallpaper.type === 'live' or wallpaper.preview is a video file
  const isLive = wallpaper.type === 'live' || 
                 (wallpaper.preview && wallpaper.preview.toLowerCase().endsWith('.mp4')) ||
                 (wallpaper.url && wallpaper.url.toLowerCase().endsWith('.mp4'));

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Wallpaper:', wallpaper.title);
    console.log('Preview URL:', wallpaper.preview);
    console.log('Is Live:', isLive);
    console.log('Has MP4:', wallpaper.preview && wallpaper.preview.toLowerCase().endsWith('.mp4'));
  }

  // Always show the download button, even if download/url is missing
  const downloadUrl = wallpaper.download || wallpaper.url || '#';

  // --- Google Drive Download Logic ---
  // Returns true if the URL is a Google Drive direct download link
  const isGoogleDriveDownload = (url) =>
    typeof url === "string" && url.startsWith("https://drive.google.com/uc?export=download&id=");

  // Handles download click for Google Drive links
  const handleDownload = (e) => {
    if (isGoogleDriveDownload(downloadUrl)) {
      e.preventDefault();
      // Try to force download by creating a temporary link and clicking it
      const tempLink = document.createElement("a");
      tempLink.href = downloadUrl;
      tempLink.setAttribute("download", "");
      tempLink.style.display = "none";
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);

      // Fallback: open in new tab if download doesn't start
      setTimeout(() => {
        window.open(downloadUrl, "_blank", "noopener,noreferrer");
      }, 1200);
    }
    // For non-Google Drive links, let the browser handle it
  };

  // --- Retro Neon Button Style (Twitch Panel Inspired) ---
  const [downloadHover, setDownloadHover] = useState(false);
  const [copyHover, setCopyHover] = useState(false);
  const retroNeonBtnStyle = (hovered, disabled, small = false) => ({
    pointerEvents: disabled ? 'none' : 'auto',
    opacity: disabled ? 0.5 : 1,
    background: '#181c2f', // Dark background
    color: '#fff', // White text
    borderRadius: '10px',
    border: '2px solid',
    borderImage: 'linear-gradient(90deg, #00fff7, #a259f7, #ff00cc) 1', // Gradient border
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: "'Press Start 2P', monospace",
    textTransform: 'uppercase',
    padding: small ? '0.5rem 1.1rem' : '0.75rem 1.5rem', // Smaller buttons
    fontSize: small ? '0.7rem' : '0.95rem', // Smaller font
    display: 'inline-block',
    marginTop: small ? '0.5rem' : '0.9rem',
    textDecoration: 'none',
    boxShadow: hovered
      ? '0 0 24px 6px #00fff7, 0 0 32px 12px #a259f7, 0 0 40px 18px #ff00cc'
      : '0 0 12px 2px #00fff7, 0 0 18px 6px #a259f7, 0 0 24px 10px #ff00cc',
    textShadow: '0 1px 2px #0008', // Subtle shadow for readability
    letterSpacing: '1.5px',
    transition: 'box-shadow 0.18s cubic-bezier(.4,2,.6,1), filter 0.18s cubic-bezier(.4,2,.6,1)',
    filter: hovered ? 'brightness(1.12)' : 'none',
    position: 'relative',
    zIndex: 1,
    width: '275px',
  });

  // Force preload the image immediately
  React.useEffect(() => {
    if (imgRef.current && imgSrc) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Preloading image:', imgSrc);
      }
      imgRef.current.loading = "eager";
      imgRef.current.decoding = "sync";
      // Force the image to load
      const tempImg = new Image();
      tempImg.onload = () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Image loaded successfully:', imgSrc);
        }
      };
      tempImg.onerror = () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Image failed to load:', imgSrc);
        }
      };
      tempImg.src = imgSrc;
    }
  }, [imgSrc]);

  // Use the working Supabase preview URL instead of broken R2 URLs
  const [videoSrc, setVideoSrc] = useState(wallpaper.preview || wallpaper.url);
  const [videoError, setVideoError] = useState(false);

  // Check if plashURL is actually working (not a broken R2 URL)
  const isPlashUrlWorking = (url) => {
    if (!url) return false;
    // If it's a retronixwallpapers.com URL that redirects to R2, it's likely broken
    if (url.includes('retronixwallpapers.com/wallpaper.html') && url.includes('r2.dev')) {
      return false;
    }
    return true;
  };

  // Handle video error using the utility function
  const handleVideoLoadError = (errorEvent) => {
    // If Supabase link fails and we have a working plashURL, try it
    if (videoSrc && videoSrc.includes('supabase.co') && wallpaper.plashURL && isPlashUrlWorking(wallpaper.plashURL) && videoSrc !== wallpaper.plashURL) {
      setVideoSrc(wallpaper.plashURL);
    } else {
      // Hide video and show error state
      setVideoError(true);
    }
  };

  return (
    <div className="wallpaper-card" style={{ position: "relative", padding: "1.2rem 0.5rem", display: "flex", flexDirection: "column", alignItems: "center", height: compact ? "540px" : "480px", width: "380px", minWidth: "500px", maxWidth: "600px", boxSizing: "border-box" }}>
      {isLive ? (
        <video
          src={videoSrc}
          muted
          loop
          playsInline
          autoPlay
          className="wallpaper-video"
          preload="metadata"
          loading="lazy"
          style={{
            opacity: videoError ? 0 : 1,
            display: videoError ? "none" : "block",
            width: "100%",
            objectFit: "cover",
            height: compact ? "400px" : "360px",
            flex: 1
          }}
          onError={(e) => handleVideoError(e, handleVideoLoadError)}
          onLoadStart={() => {
            // Reset error state when video starts loading
            setVideoError(false);
          }}
        />
      ) : (
        <img
          ref={imgRef}
          src={imgSrc}
          alt={generateWallpaperAltText(wallpaper)}
          className="wallpaper-image"
          loading="lazy"
          onLoad={() => {
            if (process.env.NODE_ENV === 'development') {
              console.log('Image loaded in DOM:', imgSrc);
            }
          }}
          onError={() => {
            if (process.env.NODE_ENV === 'development') {
              console.log('Image failed to load in DOM:', imgSrc);
            }
            setImgSrc(fallbackImg);
          }}
          style={{ 
            opacity: 1, 
            display: "block",
            width: "100%",
            objectFit: "cover",
            height: compact ? "400px" : "360px",
            flex: 1
          }}
        />
      )}
      
      {/* Show fallback image if video fails */}
      {isLive && videoError && (
        <img
          src={imgSrc}
          alt={generateWallpaperAltText(wallpaper)}
          style={{ 
            opacity: 1, 
            display: "block",
            width: "100%",
            objectFit: "cover",
            height: compact ? "400px" : "360px",
            flex: 1
          }}
        />
      )}
      
      {/* Button group always inside the card */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "1.5rem",
          minHeight: "120px"
        }}
      >
        <a
          href={downloadUrl}
          download
          style={{
            ...retroNeonBtnStyle(downloadHover, downloadUrl === '#', true),
            marginBottom: "0.7rem",
            minHeight: "45px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={isGoogleDriveDownload(downloadUrl) ? handleDownload : undefined}
          target={isGoogleDriveDownload(downloadUrl) ? "_self" : undefined}
          rel="noopener noreferrer"
          onMouseEnter={() => setDownloadHover(true)}
          onMouseLeave={() => setDownloadHover(false)}
        >
          Download
        </a>
        {/* Only show copy link button if plashURL exists and is working */}
        <button
          style={{
            ...retroNeonBtnStyle(copyHover, !isPlashUrlWorking(wallpaper.plashURL), true),
            minHeight: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            visibility: ((wallpaper.type === 'live' || (wallpaper.preview && wallpaper.preview.endsWith('.mp4'))) && isPlashUrlWorking(wallpaper.plashURL)) ? "visible" : "hidden"
          }}
          onClick={() => handleCopyPlash(wallpaper.plashURL)}
          type="button"
          title="Copy Plash Link to clipboard"
          onMouseEnter={() => setCopyHover(true)}
          onMouseLeave={() => setCopyHover(false)}
          disabled={!((wallpaper.type === 'live' || (wallpaper.preview && wallpaper.preview.endsWith('.mp4'))) && isPlashUrlWorking(wallpaper.plashURL))}
        >
          Copy Link - Mac User
        </button>
        {copied && (
          <span className="copy-feedback">Copied!</span>
        )}
      </div>
    </div>
  );
};

export default WallpaperCard;