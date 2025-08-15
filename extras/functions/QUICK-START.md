# 🚀 Quick Start Guide - Advanced Web Scraper

## What You Just Got

A complete web scraping solution integrated into your Firebase functions with:

- **CLI Tool**: Command-line interface for batch processing
- **Web Interface**: Beautiful UI for non-technical users  
- **API Endpoints**: Programmatic access
- **Advanced Features**: Anti-detection, OCR, caching, and more

## 🎯 Immediate Usage

### 1. Command Line (Fastest Start)

```bash
# Scrape a single website
node scraper-cli.js scrape https://example.com

# Scrape with custom output
node scraper-cli.js scrape https://example.com --format txt --output result.txt

# Batch scrape multiple URLs
echo "https://example1.com
https://example2.com" > urls.txt
node scraper-cli.js batch urls.txt --format csv --output results.csv
```

### 2. Web Interface (User-Friendly)

1. Deploy your functions: `firebase deploy --only functions`
2. Visit: `https://your-project.cloudfunctions.net/api/scraper`
3. Enter URLs and click "Start Scraping"

### 3. API Integration (Programmatic)

```javascript
const AdvancedWebScraper = require('./scraper');

const scraper = new AdvancedWebScraper();
const result = await scraper.scrapeUrl('https://example.com');
console.log(result.content.title);
await scraper.cleanup();
```

## 📊 What You Get

Each scrape returns structured data:

```json
{
  "url": "https://example.com",
  "status": "Success",
  "content": {
    "title": "Page Title",
    "headings": [{"level": 1, "text": "Main Heading"}],
    "lists": [{"type": "ul", "items": ["Item 1", "Item 2"]}],
    "tables": [{"rows": [["Header", "Data"]]}],
    "links": [{"href": "https://example.com/about", "text": "About"}],
    "mainContent": "All page text...",
    "metaDescription": "Page description"
  },
  "relatedPages": [{"href": "https://example.com/about", "keyword": "about"}],
  "loadTime": 2500
}
```

## ⚡ Key Features

- **Anti-Detection**: User agent rotation, random delays, human-like behavior
- **JavaScript Support**: Handles dynamic content and SPAs
- **Multiple Formats**: JSON, TXT, CSV export
- **Batch Processing**: Scrape hundreds of URLs efficiently
- **Caching**: 24-hour cache to avoid repeated requests
- **Error Handling**: Graceful retry logic and detailed error reporting

## 🔧 Common Options

```bash
# Performance tuning
--concurrent 5          # Max 5 URLs at once
--timeout 60000         # 60 second timeout
--delay 2000-5000       # 2-5 second delays

# Output control
--format csv            # CSV output
--output results.csv    # Save to file
--no-cache             # Disable caching

# Advanced
--no-robots            # Ignore robots.txt
--no-ocr              # Disable image text extraction
```

## 🚀 Deploy & Use

1. **Install Dependencies**: `npm install` (already done)
2. **Deploy Functions**: `firebase deploy --only functions`
3. **Access URLs**:
   - Web UI: `https://your-project.cloudfunctions.net/api/scraper`
   - API: `https://your-project.cloudfunctions.net/api/scraper/api/scrape`

## 📝 Examples

### Basic Usage
```bash
# Quick test
node scraper-cli.js scrape https://example.com

# Save results
node scraper-cli.js scrape https://example.com --format txt --output website.txt
```

### Batch Processing
```bash
# Create URL list
echo "https://site1.com
https://site2.com
https://site3.com" > sites.txt

# Process all
node scraper-cli.js batch sites.txt --format csv --output all-sites.csv
```

### Advanced Configuration
```bash
# High-performance scraping
node scraper-cli.js list https://site1.com https://site2.com \
  --concurrent 10 \
  --timeout 45000 \
  --delay 1000-2000 \
  --format json \
  --output results.json
```

## 🛠️ Integration with Your Code

The scraper is **non-destructive** - it doesn't modify your existing code:

```javascript
// Your existing Firebase functions work unchanged
// Scraper adds new routes at /scraper

// Use scraper in your existing functions
const AdvancedWebScraper = require('./scraper');

app.post('/my-custom-endpoint', async (req, res) => {
  const scraper = new AdvancedWebScraper();
  const result = await scraper.scrapeUrl(req.body.url);
  res.json(result);
});
```

## 🎯 Next Steps

1. **Test the CLI**: `node scraper-cli.js scrape https://example.com`
2. **Try the Web UI**: Deploy and visit the web interface
3. **Run Examples**: `node example-usage.js`
4. **Read Full Docs**: See `README-SCRAPER.md` for complete documentation

## 🆘 Need Help?

- **CLI Help**: `node scraper-cli.js --help`
- **Examples**: `node example-usage.js`
- **Full Documentation**: `README-SCRAPER.md`
- **Web Interface**: Built-in help and error messages

---

**Ready to scrape! 🚀** Your advanced web scraping tool is fully integrated and ready to use. 