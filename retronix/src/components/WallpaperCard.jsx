import React, { useRef, useState } from "react";

const fallbackImg = "/fallback-thumb.png"; // Used if the main image fails to load

const WallpaperCard = ({ wallpaper, compact }) => {
  const videoRef = useRef(null);
  const imgRef = useRef(null);
  
  // Debug log to help diagnose issues
  console.log('WallpaperCard rendering:', wallpaper.title, 'thumbnail:', wallpaper.thumbnail);

  // Clean the thumbnail URL by removing trailing backslashes and ensuring it's valid
  const cleanThumbnailUrl = (url) => {
    if (!url) return fallbackImg;
    const cleaned = url.replace(/\\+$/, '').trim();
    console.log('Cleaned URL:', url, '->', cleaned);
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
  const isLive = wallpaper.type === 'live' || ((wallpaper.preview || wallpaper.url) && (wallpaper.preview || wallpaper.url).endsWith('.mp4'));

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
      console.log('Preloading image:', imgSrc);
      imgRef.current.loading = "eager";
      imgRef.current.decoding = "sync";
      // Force the image to load
      const tempImg = new Image();
      tempImg.onload = () => console.log('Image loaded successfully:', imgSrc);
      tempImg.onerror = () => console.error('Image failed to load:', imgSrc);
      tempImg.src = imgSrc;
    }
  }, [imgSrc]);

  const [videoSrc, setVideoSrc] = useState(wallpaper.preview || wallpaper.url);

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
          preload="auto"
          style={{
            opacity: 1,
            display: "block",
            width: "100%",
            objectFit: "cover",
            height: compact ? "400px" : "360px",
            flex: 1
          }}
          onError={e => {
            console.error('Video failed to load:', e.target.src);
            // If Supabase link and plashURL exists, try plashURL
            if (videoSrc && videoSrc.includes('supabase.co') && wallpaper.plashURL && videoSrc !== wallpaper.plashURL) {
              setVideoSrc(wallpaper.plashURL);
            } else {
              e.target.style.display = 'none';
            }
          }}
        />
      ) : (
        <img
          ref={imgRef}
          src={imgSrc}
          alt={wallpaper.title || "Wallpaper"}
          className="wallpaper-image"
          loading="eager"
          onLoad={() => console.log('Image loaded in DOM:', imgSrc)}
          onError={() => {
            console.error('Image failed to load in DOM:', imgSrc);
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
        {/* Removed fallback sentence */}
        <button
          style={{
            ...retroNeonBtnStyle(copyHover, wallpaper.plashURL === '#', true),
            minHeight: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            visibility: ((wallpaper.type === 'live' || (wallpaper.preview && wallpaper.preview.endsWith('.mp4'))) && wallpaper.plashURL) ? "visible" : "hidden"
          }}
          onClick={() => handleCopyPlash(wallpaper.plashURL)}
          type="button"
          title="Copy Plash Link to clipboard"
          onMouseEnter={() => setCopyHover(true)}
          onMouseLeave={() => setCopyHover(false)}
          disabled={!((wallpaper.type === 'live' || (wallpaper.preview && wallpaper.preview.endsWith('.mp4'))) && wallpaper.plashURL)}
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