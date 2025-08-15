// src/components/WallpaperGridHeader.jsx

import React from "react";

const WallpaperGridHeader = ({
  title = "Your Wallpaper Grid",
}) => {
  return (
    <div
      className="wallpaper-grid-header"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "1400px",
        marginTop: "12vh",
        margin: "0 auto",
        padding: "1.2rem 2rem",
        gap: "1.2rem",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontWeight: "bold",
          textTransform: "uppercase",
          backgroundImage:
            "linear-gradient(-225deg, #43b7cc 0%, #a72d84 29%, #eb13ff 67%, #8e2ac4c1 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textDecoration: "none",
          fontSize: "4rem",
          padding: "0.5rem 1rem",
          animation: "textclip 4s linear infinite",
          transition: "transform 0.2s ease",
          margin: 0,
        }}
      >
        {title}
      </h1>
    </div>
  );
};

export default WallpaperGridHeader;