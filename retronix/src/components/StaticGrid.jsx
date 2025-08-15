// src/components/StaticGrid.jsx

import { useEffect, useState } from "react";
import WallpaperCard from "../components/WallpaperCard";
import React from "react";

const PAGE_SIZE = 9;

function StaticGrid() {
  const [allWallpapers, setAllWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch("/static_wallpapers.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load static wallpapers.");
        return res.json();
      })
      .then((data) => {
        const cleanedData = data.map((wp) => ({
          ...wp,
          thumbnail: wp.thumbnail ? wp.thumbnail.replace(/\\+$/, '').trim() : wp.thumbnail,
          thumb: wp.thumb ? wp.thumb.replace(/\\+$/, '').trim() : wp.thumb,
          preview: wp.preview ? wp.preview.replace(/\\+$/, '').trim() : wp.preview
        }));
        setAllWallpapers(cleanedData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const categories = Array.from(new Set(allWallpapers.map((wp) => wp.category || "Misc")));
  const filteredWallpapers =
    selectedCategory === "all"
      ? allWallpapers
      : allWallpapers.filter((wp) => (wp.category || "Misc") === selectedCategory);

  const totalPages = Math.ceil(filteredWallpapers.length / PAGE_SIZE);
  const pagedWallpapers = filteredWallpapers.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(0);
  };

  if (loading) return <div className="loading">Loading wallpapers...</div>;
  if (error) return <div className="error-msg">{error}</div>;
  if (!filteredWallpapers.length) return <div className="no-wallpapers">No wallpapers found.</div>;

  return (
    <div className="container no-top-pad">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem", width: "100%" }}>
        <label
          htmlFor="static-category-select"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "2.2rem",
            lineHeight: 1.4,
            textAlign: "center",
            padding: "0.8rem 1.2rem",
            background: "rgba(0, 0, 0, 0.7)",
            borderRadius: "12px",
            border: "2px solid #ff00cc",
            boxShadow: "0 0 12px rgba(255, 0, 255, 0.5)",
            color: "#ff99cc",
            letterSpacing: "0.6px",
            textShadow: "0 0 6px #ff00cc",
            marginBottom: "1rem"
          }}
        >
          Category:
        </label>
        <select
          id="static-category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{
            padding: "1rem 2rem",
            borderRadius: "12px",
            fontSize: "1.5rem",
            fontFamily: "'Press Start 2P', monospace",
            background: "#1a0025",
            color: "#fff",
            border: "2px solid #ff00cc",
            textShadow: "0 0 4px #ff00cc",
            boxShadow: "0 0 16px #ff00ccaa",
            outline: "none",
            cursor: "pointer",
            minWidth: "200px",
            maxWidth: "90vw",
            textAlign: "center"
          }}
        >
          <option value="all">All ⬇️</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Responsive wallpaper grid: pure CSS solution */}
      <div className="wallpaper-grid-custom">
        {pagedWallpapers.map((wp, idx) => (
          <WallpaperCard key={wp.id || wp.thumb || `${wp.title}-${idx}`} wallpaper={wp} />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", margin: "2rem 0" }}>
        <button
          onClick={handlePrev}
          disabled={page === 0}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "12px",
            fontFamily: "'Press Start 2P', monospace",
            background: "linear-gradient(45deg, #ff00cc, #3333ff)",
            color: "#fff",
            boxShadow: "0 0 16px #ff00ccaa",
            border: "none",
            cursor: page === 0 ? "not-allowed" : "pointer",
            opacity: page === 0 ? 0.5 : 1,
            transition: "transform 0.2s ease, box-shadow 0.2s ease"
          }}
          onMouseEnter={(e) => {
            if (page !== 0) {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 0 24px #ff00ccaa";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 0 16px #ff00ccaa";
          }}
        >
          Prev
        </button>
        <span
          style={{
            fontFamily: "'Press Start 2P', monospace", // Retro pixel font
  fontSize: "2rem", // Medium-large size
  color: "rgb(248, 201, 113)",
  letterSpacing: "0.6px",
  textShadow: `
    1px 1px rgb(208, 28, 154),
    1px 2px rgb(208, 28, 154),
    1px 3px rgb(208, 28, 154),
    1px 4px rgb(208, 28, 154),
    1px 5px rgb(208, 28, 154),
    1px 6px rgb(208, 28, 154)
  `,
  marginBottom: "1rem", // Space below the brand title
          }}
        >
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages - 1}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "12px",
            fontFamily: "'Press Start 2P', monospace",
            background: "linear-gradient(45deg, #ff00cc, #3333ff)",
            color: "#fff",
            boxShadow: "0 0 16px #ff00ccaa",
            border: "none",
            cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
            opacity: page === totalPages - 1 ? 0.5 : 1,
            transition: "transform 0.2s ease, box-shadow 0.2s ease"
          }}
          onMouseEnter={(e) => {
            if (page !== totalPages - 1) {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 0 24px #ff00ccaa";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 0 16px #ff00ccaa";
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default StaticGrid;