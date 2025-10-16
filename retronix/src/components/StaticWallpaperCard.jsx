import React from "react";

const fallbackImg = "/fallback-thumb.png";

const StaticWallpaperCard = ({ wallpaper }) => {
  const [imgSrc, setImgSrc] = React.useState(wallpaper.thumbnail || wallpaper.thumb);

  return (
    <div className="wallpaper-card" style={{ position: "relative" }}>
      <img
        src={imgSrc}
        alt={`${wallpaper.title || "Retro"} ${wallpaper.category || "vaporwave"} static wallpaper in 4K - nostalgic retro background`}
        className="wallpaper-image"
        loading="lazy"
        onError={() => setImgSrc(fallbackImg)}
      />
      <a
        href={wallpaper.url}
        download
        className="download-link"
      >
        Download
      </a>
    </div>
  );
};

export default StaticWallpaperCard; 