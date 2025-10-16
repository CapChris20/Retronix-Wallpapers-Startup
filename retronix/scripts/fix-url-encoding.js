#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the live wallpapers JSON file
const liveWallpapersPath = path.join(__dirname, '../public/live_wallpapers.json');

// Function to properly encode a URL
const encodeUrl = (url) => {
  if (!url) return url;
  
  try {
    // Parse the URL to get the pathname
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Split the pathname into parts
    const parts = pathname.split('/');
    
    // Encode the filename (last part) properly
    const filename = parts[parts.length - 1];
    const encodedFilename = encodeURIComponent(filename);
    
    // Reconstruct the URL with encoded filename
    parts[parts.length - 1] = encodedFilename;
    urlObj.pathname = parts.join('/');
    
    return urlObj.toString();
  } catch (error) {
    // If URL parsing fails, try basic encoding
    return encodeURI(url);
  }
};

// Function to fix URL encoding in wallpapers data
const fixUrlEncoding = (wallpapers) => {
  let fixedCount = 0;
  let totalCount = wallpapers.length;
  
  const fixed = wallpapers.map((wallpaper, index) => {
    let hasChanges = false;
    const fixedWallpaper = { ...wallpaper };
    
    // Fix preview URL
    if (wallpaper.preview) {
      const encodedPreview = encodeUrl(wallpaper.preview);
      if (encodedPreview !== wallpaper.preview) {
        fixedWallpaper.preview = encodedPreview;
        hasChanges = true;
        console.log(`[${index + 1}/${totalCount}] Fixed preview URL for: ${wallpaper.title}`);
      }
    }
    
    // Fix thumbnail URL
    if (wallpaper.thumbnail) {
      const encodedThumbnail = encodeUrl(wallpaper.thumbnail);
      if (encodedThumbnail !== wallpaper.thumbnail) {
        fixedWallpaper.thumbnail = encodedThumbnail;
        hasChanges = true;
      }
    }
    
    // Fix plashURL (re-encode with the fixed preview URL)
    if (wallpaper.preview && wallpaper.plashURL) {
      const encodedPreview = encodeUrl(wallpaper.preview);
      const newPlashUrl = `https://retronixwallpapers.com/wallpaper.html?url=${encodeURIComponent(encodedPreview)}`;
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
    console.log('🔧 Starting URL encoding fixes for preview and thumbnail URLs...');
    
    // Read the JSON file
    const jsonData = fs.readFileSync(liveWallpapersPath, 'utf8');
    const wallpapers = JSON.parse(jsonData);
    
    console.log(`📊 Found ${wallpapers.length} wallpapers`);
    
    // Fix the URL encoding
    const { fixed, fixedCount, totalCount } = fixUrlEncoding(wallpapers);
    
    // Write the fixed data back to the file
    fs.writeFileSync(liveWallpapersPath, JSON.stringify(fixed, null, 2));
    
    console.log(`✅ URL encoding fixes complete!`);
    console.log(`📈 Fixed ${fixedCount} wallpapers with encoding issues`);
    console.log(`📊 Total wallpapers: ${totalCount}`);
    console.log(`💾 File updated: ${liveWallpapersPath}`);
    console.log(`🔗 Preview URLs should now work properly in browsers!`);
    
  } catch (error) {
    console.error('❌ Error during URL encoding fixes:', error.message);
    process.exit(1);
  }
};

// Run the script
main();


