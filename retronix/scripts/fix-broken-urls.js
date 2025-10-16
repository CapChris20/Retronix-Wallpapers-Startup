#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the live wallpapers JSON file
const liveWallpapersPath = path.join(__dirname, '../public/live_wallpapers.json');

// Function to check if a URL is broken (R2 URLs that return 404)
const isBrokenUrl = (url) => {
  if (!url) return false;
  // Check if it's a retronixwallpapers.com URL that redirects to R2
  if (url.includes('retronixwallpapers.com/wallpaper.html') && url.includes('r2.dev')) {
    return true;
  }
  return false;
};

// Function to clean up the wallpapers data
const cleanWallpapersData = (wallpapers) => {
  let cleanedCount = 0;
  let totalCount = wallpapers.length;
  
  const cleaned = wallpapers.map((wallpaper, index) => {
    // If plashURL is broken, remove it
    if (wallpaper.plashURL && isBrokenUrl(wallpaper.plashURL)) {
      cleanedCount++;
      console.log(`[${index + 1}/${totalCount}] Removing broken plashURL for: ${wallpaper.title}`);
      const { plashURL, ...cleanedWallpaper } = wallpaper;
      return cleanedWallpaper;
    }
    
    return wallpaper;
  });
  
  return { cleaned, cleanedCount, totalCount };
};

// Main function
const main = async () => {
  try {
    console.log('🔧 Starting cleanup of broken URLs in live_wallpapers.json...');
    
    // Read the JSON file
    const jsonData = fs.readFileSync(liveWallpapersPath, 'utf8');
    const wallpapers = JSON.parse(jsonData);
    
    console.log(`📊 Found ${wallpapers.length} wallpapers`);
    
    // Clean up the data
    const { cleaned, cleanedCount, totalCount } = cleanWallpapersData(wallpapers);
    
    // Write the cleaned data back to the file
    fs.writeFileSync(liveWallpapersPath, JSON.stringify(cleaned, null, 2));
    
    console.log(`✅ Cleanup complete!`);
    console.log(`📈 Removed ${cleanedCount} broken plashURLs`);
    console.log(`📊 Total wallpapers: ${totalCount}`);
    console.log(`💾 File updated: ${liveWallpapersPath}`);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }
};

// Run the script
main();
