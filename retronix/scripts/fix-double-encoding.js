#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the live wallpapers JSON file
const liveWallpapersPath = path.join(__dirname, '../public/live_wallpapers.json');

// Function to fix double-encoded URLs
const fixDoubleEncoding = (url) => {
  if (!url) return url;
  
  // Fix double-encoded spaces (%2520 -> %20)
  let fixed = url.replace(/%2520/g, '%20');
  
  // Fix double-encoded commas (%252C -> %2C)
  fixed = fixed.replace(/%252C/g, '%2C');
  
  // Fix double-encoded other characters
  fixed = fixed.replace(/%2525/g, '%25');
  fixed = fixed.replace(/%252F/g, '%2F');
  fixed = fixed.replace(/%252E/g, '.');
  
  return fixed;
};

// Function to fix all URLs in wallpapers data
const fixAllUrls = (wallpapers) => {
  let fixedCount = 0;
  let totalCount = wallpapers.length;
  
  const fixed = wallpapers.map((wallpaper, index) => {
    let hasChanges = false;
    const fixedWallpaper = { ...wallpaper };
    
    // Fix preview URL
    if (wallpaper.preview) {
      const fixedPreview = fixDoubleEncoding(wallpaper.preview);
      if (fixedPreview !== wallpaper.preview) {
        fixedWallpaper.preview = fixedPreview;
        hasChanges = true;
        console.log(`[${index + 1}/${totalCount}] Fixed preview URL for: ${wallpaper.title}`);
      }
    }
    
    // Fix thumbnail URL
    if (wallpaper.thumbnail) {
      const fixedThumbnail = fixDoubleEncoding(wallpaper.thumbnail);
      if (fixedThumbnail !== wallpaper.thumbnail) {
        fixedWallpaper.thumbnail = fixedThumbnail;
        hasChanges = true;
      }
    }
    
    // Fix plashURL (re-encode with the fixed preview URL)
    if (wallpaper.preview && wallpaper.plashURL) {
      const fixedPreview = fixDoubleEncoding(wallpaper.preview);
      const newPlashUrl = `https://retronixwallpapers.com/wallpaper.html?url=${encodeURIComponent(fixedPreview)}`;
      if (newPlashUrl !== wallpaper.plashURL) {
        fixedWallpaper.plashURL = newPlashUrl;
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      fixedCount++;
    }
    
    return fixedWallpaper;
  });
  
  return { fixed, fixedCount, totalCount };
};

// Main function
const main = async () => {
  try {
    console.log('🔧 Starting fix for double-encoded URLs...');
    
    // Read the JSON file
    const jsonData = fs.readFileSync(liveWallpapersPath, 'utf8');
    const wallpapers = JSON.parse(jsonData);
    
    console.log(`📊 Found ${wallpapers.length} wallpapers`);
    
    // Fix the double-encoded URLs
    const { fixed, fixedCount, totalCount } = fixAllUrls(wallpapers);
    
    // Write the fixed data back to the file
    fs.writeFileSync(liveWallpapersPath, JSON.stringify(fixed, null, 2));
    
    console.log(`✅ Double-encoding fix complete!`);
    console.log(`📈 Fixed ${fixedCount} wallpapers with encoding issues`);
    console.log(`📊 Total wallpapers: ${totalCount}`);
    console.log(`💾 File updated: ${liveWallpapersPath}`);
    console.log(`🎥 Videos should now load properly!`);
    
  } catch (error) {
    console.error('❌ Error during double-encoding fix:', error.message);
    process.exit(1);
  }
};

// Run the script
main();
