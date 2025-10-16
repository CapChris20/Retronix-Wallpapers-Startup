#!/usr/bin/env node

/**
 * Robots.txt Generator for Retronix Wallpapers
 * Generates a comprehensive robots.txt file for better SEO crawling
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://retronixwallpapers.com';
const ROBOTS_PATH = path.join(__dirname, '../dist/robots.txt');

function generateRobots() {
  console.log('🤖 Generating robots.txt for Retronix Wallpapers...');
  
  const robotsContent = `User-agent: *
Allow: /

# Main pages
Allow: /wallpapers
Allow: /about
Allow: /contact
Allow: /faq
Allow: /pricing
Allow: /instructions
Allow: /privacy
Allow: /terms

# Wallpaper categories and types
Allow: /wallpapers?*
Allow: /wallpaper/*

# Static assets
Allow: /static_wallpapers.json
Allow: /live_wallpapers.json
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.png
Allow: /*.mp4
Allow: /*.webp
Allow: /assets/
Allow: /images/

# Favicon and manifest
Allow: /favicon.ico
Allow: /favicon-*
Allow: /android-chrome-*
Allow: /apple-touch-icon*
Allow: /site.webmanifest
Allow: /manifest.json

# Disallow admin or private areas
Disallow: /admin/
Disallow: /private/
Disallow: /api/
Disallow: /_redirects
Disallow: /src/
Disallow: /node_modules/

# Disallow query parameters that don't add value
Disallow: /*?utm_*
Disallow: /*?ref=*
Disallow: /*?source=*

# Allow specific search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: YandexBot
Allow: /

# Crawl delay (be respectful to servers)
Crawl-delay: 1

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml

# Additional sitemaps for better organization
Sitemap: ${SITE_URL}/sitemap-images.xml
Sitemap: ${SITE_URL}/sitemap-videos.xml
`;

  // Ensure dist directory exists
  const distDir = path.dirname(ROBOTS_PATH);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Write robots.txt
  fs.writeFileSync(ROBOTS_PATH, robotsContent);
  
  console.log(`✅ Robots.txt generated successfully`);
  console.log(`📁 Saved to: ${ROBOTS_PATH}`);
  
  return robotsContent;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateRobots();
}

export { generateRobots };
