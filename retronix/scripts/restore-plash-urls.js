#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the live wallpapers JSON file
const liveWallpapersPath = path.join(__dirname, '../public/live_wallpapers.json');

// Function to create a properly encoded plashURL from Supabase URL
const createPlashUrl = (supabaseUrl) => {
  if (!supabaseUrl) return null;
  
  // Encode the Supabase URL properly for use as a plashURL
  const encodedUrl = encodeURIComponent(supabaseUrl);
  return `https://retronixwallpapers.com/wallpaper.html?url=${encodedUrl}`;
};

// Function to restore plashURLs using working Supabase URLs
const restorePlashUrls = (wallpapers) => {
  let restoredCount = 0;
  let totalCount = wallpapers.length;
  
  const restored = wallpapers.map((wallpaper, index) => {
    // Only add plashURL if we have a working preview URL
    if (wallpaper.preview && wallpaper.preview.includes('supabase.co')) {
      const plashUrl = createPlashUrl(wallpaper.preview);
      if (plashUrl) {
        restoredCount++;
        console.log(`[${index + 1}/${totalCount}] Restoring plashURL for: ${wallpaper.title}`);
        return {
          ...wallpaper,
          plashURL: plashUrl
        };
      }
    }
    
    return wallpaper;
  });
  
  return { restored, restoredCount, totalCount };
};

// Main function
const main = async () => {
  try {
    console.log('🔧 Starting restoration of plashURLs using working Supabase URLs...');
    
    // Read the JSON file
    const jsonData = fs.readFileSync(liveWallpapersPath, 'utf8');
    const wallpapers = JSON.parse(jsonData);
    
    console.log(`📊 Found ${wallpapers.length} wallpapers`);
    
    // Restore the plashURLs
    const { restored, restoredCount, totalCount } = restorePlashUrls(wallpapers);
    
    // Write the restored data back to the file
    fs.writeFileSync(liveWallpapersPath, JSON.stringify(restored, null, 2));
    
    console.log(`✅ Restoration complete!`);
    console.log(`📈 Restored ${restoredCount} plashURLs using working Supabase URLs`);
    console.log(`📊 Total wallpapers: ${totalCount}`);
    console.log(`💾 File updated: ${liveWallpapersPath}`);
    console.log(`🔗 Users can now copy working plash links!`);
    
  } catch (error) {
    console.error('❌ Error during restoration:', error.message);
    process.exit(1);
  }
};

// Run the script
main();

