#!/usr/bin/env node

/**
 * Sitemap Generator for Retronix Wallpapers
 * Generates a comprehensive sitemap.xml with all pages and wallpaper categories
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://retronixwallpapers.com';
const SITEMAP_PATH = path.join(__dirname, '../dist/sitemap.xml');
const STATIC_WALLPAPERS_PATH = path.join(__dirname, '../dist/static_wallpapers.json');
const LIVE_WALLPAPERS_PATH = path.join(__dirname, '../dist/live_wallpapers.json');

// Static pages configuration
const STATIC_PAGES = [
  {
    url: '/',
    priority: '1.0',
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/wallpapers',
    priority: '0.9',
    changefreq: 'daily',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/about',
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/contact',
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/faq',
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/pricing',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/premium',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/instructions',
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/privacy',
    priority: '0.3',
    changefreq: 'yearly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/terms',
    priority: '0.3',
    changefreq: 'yearly',
    lastmod: new Date().toISOString().split('T')[0]
  }
];

// Wallpaper categories
const WALLPAPER_CATEGORIES = [
  'synthwave',
  'vaporwave',
  'retro',
  '80s',
  'neon',
  'cyberpunk',
  'outrun',
  'misc'
];

// Wallpaper types
const WALLPAPER_TYPES = [
  'live',
  'static',
  'premium'
];

function loadWallpaperData() {
  let staticWallpapers = [];
  let liveWallpapers = [];
  
  try {
    if (fs.existsSync(STATIC_WALLPAPERS_PATH)) {
      staticWallpapers = JSON.parse(fs.readFileSync(STATIC_WALLPAPERS_PATH, 'utf8'));
    }
  } catch (error) {
    console.warn('Could not load static wallpapers:', error.message);
  }
  
  try {
    if (fs.existsSync(LIVE_WALLPAPERS_PATH)) {
      liveWallpapers = JSON.parse(fs.readFileSync(LIVE_WALLPAPERS_PATH, 'utf8'));
    }
  } catch (error) {
    console.warn('Could not load live wallpapers:', error.message);
  }
  
  return { staticWallpapers, liveWallpapers };
}

function generateCategoryUrls() {
  const urls = [];
  
  // Generate category pages
  WALLPAPER_CATEGORIES.forEach(category => {
    urls.push({
      url: `/wallpapers?category=${category}`,
      priority: '0.8',
      changefreq: 'daily',
      lastmod: new Date().toISOString().split('T')[0]
    });
  });
  
  // Generate type pages
  WALLPAPER_TYPES.forEach(type => {
    urls.push({
      url: `/wallpapers?type=${type}`,
      priority: '0.8',
      changefreq: 'daily',
      lastmod: new Date().toISOString().split('T')[0]
    });
  });
  
  // Generate combined category + type pages
  WALLPAPER_CATEGORIES.forEach(category => {
    WALLPAPER_TYPES.forEach(type => {
      urls.push({
        url: `/wallpapers?category=${category}&type=${type}`,
        priority: '0.7',
        changefreq: 'daily',
        lastmod: new Date().toISOString().split('T')[0]
      });
    });
  });
  
  return urls;
}

function generateWallpaperUrls(wallpapers, type) {
  const urls = [];
  const maxWallpapers = 100; // Limit to prevent sitemap from being too large
  
  wallpapers.slice(0, maxWallpapers).forEach((wallpaper, index) => {
    if (wallpaper.title && wallpaper.title !== '.DS_Store') {
      const encodedTitle = encodeURIComponent(wallpaper.title.replace(/[^a-zA-Z0-9\s-]/g, '').trim());
      urls.push({
        url: `/wallpaper/${encodedTitle}`,
        priority: '0.6',
        changefreq: 'monthly',
        lastmod: new Date().toISOString().split('T')[0]
      });
    }
  });
  
  return urls;
}

function generateSitemap() {
  console.log('🗺️  Generating sitemap for Retronix Wallpapers...');
  
  const { staticWallpapers, liveWallpapers } = loadWallpaperData();
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

  // Add static pages
  STATIC_PAGES.forEach(page => {
    sitemap += `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  // Add category and type pages
  const categoryUrls = generateCategoryUrls();
  categoryUrls.forEach(page => {
    sitemap += `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  // Add individual wallpaper pages (limited to prevent sitemap from being too large)
  const staticWallpaperUrls = generateWallpaperUrls(staticWallpapers, 'static');
  const liveWallpaperUrls = generateWallpaperUrls(liveWallpapers, 'live');
  
  [...staticWallpaperUrls, ...liveWallpaperUrls].forEach(page => {
    sitemap += `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  // Ensure dist directory exists
  const distDir = path.dirname(SITEMAP_PATH);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Write sitemap
  fs.writeFileSync(SITEMAP_PATH, sitemap);
  
  const totalUrls = STATIC_PAGES.length + categoryUrls.length + staticWallpaperUrls.length + liveWallpaperUrls.length;
  console.log(`✅ Sitemap generated successfully with ${totalUrls} URLs`);
  console.log(`📁 Saved to: ${SITEMAP_PATH}`);
  
  return totalUrls;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap();
}

export { generateSitemap, loadWallpaperData };
