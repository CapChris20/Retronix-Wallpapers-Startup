#!/usr/bin/env node

const AdvancedWebScraper = require('./scraper');
const fs = require('fs-extra');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

// Help function
function showHelp() {
  console.log(`
Advanced Web Scraper CLI Tool

Usage:
  node scraper-cli.js <command> [options]

Commands:
  scrape <url>                    Scrape a single URL
  batch <file>                    Scrape multiple URLs from a file (one URL per line)
  list <url1> <url2> ...          Scrape multiple URLs provided as arguments

Options:
  --format <format>               Output format: json, txt, csv (default: json)
  --output <file>                 Output file path (default: stdout)
  --headless <true|false>         Run browser in headless mode (default: true)
  --timeout <ms>                  Page load timeout in milliseconds (default: 30000)
  --retries <number>              Number of retry attempts (default: 3)
  --delay <min>-<max>             Delay range between requests in ms (default: 1000-3000)
  --concurrent <number>           Maximum concurrent requests (default: 3)
  --no-cache                      Disable caching
  --no-robots                     Ignore robots.txt
  --no-ocr                        Disable OCR for images
  --help                          Show this help message

Examples:
  node scraper-cli.js scrape https://example.com
  node scraper-cli.js scrape https://example.com --format txt --output result.txt
  node scraper-cli.js batch urls.txt --format csv --output results.csv
  node scraper-cli.js list https://example1.com https://example2.com --concurrent 5
  `);
}

// Parse options from command line arguments
function parseOptions(args) {
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--format') {
      options.format = args[++i];
    } else if (arg === '--output') {
      options.output = args[++i];
    } else if (arg === '--headless') {
      options.headless = args[++i] === 'true';
    } else if (arg === '--timeout') {
      options.timeout = parseInt(args[++i]);
    } else if (arg === '--retries') {
      options.retryAttempts = parseInt(args[++i]);
    } else if (arg === '--delay') {
      const delayRange = args[++i].split('-');
      options.delayRange = [parseInt(delayRange[0]), parseInt(delayRange[1])];
    } else if (arg === '--concurrent') {
      options.maxConcurrent = parseInt(args[++i]);
    } else if (arg === '--no-cache') {
      options.cacheEnabled = false;
    } else if (arg === '--no-robots') {
      options.respectRobotsTxt = false;
    } else if (arg === '--no-ocr') {
      options.enableOCR = false;
    }
  }
  
  return options;
}

// Validate URL format
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Main scraping function
async function scrapeUrls(urls, options = {}) {
  const scraper = new AdvancedWebScraper(options);
  
  try {
    console.log(`🚀 Starting web scraping for ${urls.length} URL(s)...`);
    console.log(`📋 Options:`, JSON.stringify(options, null, 2));
    console.log('');
    
    let results;
    if (urls.length === 1) {
      results = [await scraper.scrapeUrl(urls[0])];
    } else {
      results = await scraper.scrapeMultipleUrls(urls, options.maxConcurrent);
    }
    
    // Export results
    const format = options.format || 'json';
    const output = await scraper.exportResults(results, format, options.output);
    
    if (!options.output) {
      console.log(output);
    } else {
      console.log(`✅ Results saved to: ${options.output}`);
    }
    
    // Print summary
    const successful = results.filter(r => r.status === 'Success').length;
    const failed = results.filter(r => r.status === 'Failed').length;
    const blocked = results.filter(r => r.status === 'Blocked').length;
    const cached = results.filter(r => r.cached).length;
    
    console.log('');
    console.log('📊 Summary:');
    console.log(`  ✅ Successful: ${successful}`);
    console.log(`  ❌ Failed: ${failed}`);
    console.log(`  🚫 Blocked: ${blocked}`);
    console.log(`  💾 Cached: ${cached}`);
    console.log(`  ⏱️  Total time: ${results.reduce((sum, r) => sum + (r.loadTime || 0), 0)}ms`);
    
    return results;
    
  } catch (error) {
    console.error('❌ Error during scraping:', error.message);
    process.exit(1);
  } finally {
    await scraper.cleanup();
  }
}

// Main CLI logic
async function main() {
  if (command === '--help' || command === 'help' || !command) {
    showHelp();
    return;
  }
  
  try {
    if (command === 'scrape') {
      const url = args[1];
      if (!url || !isValidUrl(url)) {
        console.error('❌ Please provide a valid URL');
        process.exit(1);
      }
      
      const options = parseOptions(args.slice(2));
      await scrapeUrls([url], options);
      
    } else if (command === 'batch') {
      const filePath = args[1];
      if (!filePath) {
        console.error('❌ Please provide a file path');
        process.exit(1);
      }
      
      if (!await fs.pathExists(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        process.exit(1);
      }
      
      const fileContent = await fs.readFile(filePath, 'utf8');
      const urls = fileContent.split('\n')
        .map(line => line.trim())
        .filter(line => line && isValidUrl(line));
      
      if (urls.length === 0) {
        console.error('❌ No valid URLs found in file');
        process.exit(1);
      }
      
      console.log(`📁 Found ${urls.length} URLs in ${filePath}`);
      const options = parseOptions(args.slice(2));
      await scrapeUrls(urls, options);
      
    } else if (command === 'list') {
      const urls = args.slice(1).filter(url => isValidUrl(url));
      
      if (urls.length === 0) {
        console.error('❌ Please provide at least one valid URL');
        process.exit(1);
      }
      
      const options = parseOptions(args.slice(1 + urls.length));
      await scrapeUrls(urls, options);
      
    } else {
      console.error(`❌ Unknown command: ${command}`);
      showHelp();
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Scraping interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Scraping terminated');
  process.exit(0);
});

// Run the CLI
if (require.main === module) {
  main();
}

module.exports = { scrapeUrls, parseOptions, isValidUrl }; 