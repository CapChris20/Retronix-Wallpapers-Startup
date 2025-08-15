# Advanced Web Scraper Tool

A robust web scraping solution that can extract content from modern websites that block basic HTTP requests. Built with Puppeteer for handling JavaScript-heavy sites and anti-bot protection.

## 🚀 Features

### Core Functionality
- **Browser Automation**: Uses Puppeteer for headless browser control
- **Anti-Detection**: Mimics real browser behavior with user agent rotation
- **Dynamic Content**: Handles JavaScript-loaded content
- **Comprehensive Extraction**: Extracts text, headings, lists, tables, and links
- **Related Pages**: Automatically finds and extracts important subpages (About, Pricing, FAQ, etc.)

### Technical Capabilities
- **User Agent Rotation**: 5 different realistic user agents
- **Random Delays**: 1-3 second delays between requests
- **Viewport Randomization**: Random screen sizes to avoid detection
- **Human-like Behavior**: Mouse movements and scrolling simulation
- **Retry Logic**: Exponential backoff with configurable attempts
- **Robots.txt Respect**: Optional robots.txt compliance

### Content Extraction
- **Structured Data**: Preserves heading hierarchy (H1-H6)
- **Lists & Tables**: Extracts ordered/unordered lists and table data
- **Navigation Links**: Finds and categorizes important page links
- **Image Text**: OCR extraction from images with alt text
- **Meta Information**: Title, description, keywords extraction

### Anti-Detection Measures
- **Cloudflare Bypass**: Advanced browser fingerprinting evasion
- **Rate Limiting**: Intelligent request spacing
- **Session Management**: Cookie and session handling
- **CAPTCHA Detection**: Pause and notify on CAPTCHA encounters

## 📦 Installation

The scraper is already integrated into your Firebase functions. Dependencies are included in `package.json`:

```bash
cd functions
npm install
```

## 🛠️ Usage

### 1. Command Line Interface (CLI)

The scraper includes a powerful CLI tool for batch processing:

```bash
# Scrape a single URL
node scraper-cli.js scrape https://example.com

# Scrape with custom options
node scraper-cli.js scrape https://example.com --format txt --output result.txt --concurrent 5

# Batch scrape from file
node scraper-cli.js batch urls.txt --format csv --output results.csv

# Scrape multiple URLs
node scraper-cli.js list https://example1.com https://example2.com --timeout 60
```

#### CLI Options
- `--format`: Output format (json, txt, csv)
- `--output`: Output file path
- `--headless`: Run browser in headless mode (true/false)
- `--timeout`: Page load timeout in milliseconds
- `--retries`: Number of retry attempts
- `--delay`: Delay range between requests (min-max)
- `--concurrent`: Maximum concurrent requests
- `--no-cache`: Disable caching
- `--no-robots`: Ignore robots.txt
- `--no-ocr`: Disable OCR for images

### 2. Web Interface

Access the user-friendly web interface at:
```
https://your-firebase-function-url/scraper
```

Features:
- Beautiful, responsive UI
- Real-time progress tracking
- Comprehensive results display
- Export options (JSON, TXT, CSV)
- Advanced configuration options

### 3. API Integration

Use the scraper programmatically in your code:

```javascript
const AdvancedWebScraper = require('./scraper');

// Create scraper instance
const scraper = new AdvancedWebScraper({
  headless: true,
  timeout: 30000,
  retryAttempts: 3,
  maxConcurrent: 3,
  cacheEnabled: true
});

// Scrape single URL
const result = await scraper.scrapeUrl('https://example.com');
console.log(result);

// Scrape multiple URLs
const results = await scraper.scrapeMultipleUrls([
  'https://example1.com',
  'https://example2.com'
]);

// Export results
const csvData = await scraper.exportResults(results, 'csv', 'output.csv');

// Cleanup
await scraper.cleanup();
```

## 🔧 Configuration Options

### Scraper Options
```javascript
const options = {
  headless: true,              // Run browser in headless mode
  timeout: 30000,              // Page load timeout (ms)
  retryAttempts: 3,            // Number of retry attempts
  delayRange: [1000, 3000],    // Delay range between requests (ms)
  viewportRange: {             // Random viewport sizes
    width: [1200, 1920],
    height: [800, 1080]
  },
  respectRobotsTxt: true,      // Respect robots.txt
  enableOCR: true,             // Extract text from images
  maxConcurrent: 3,            // Max concurrent requests
  cacheEnabled: true,          // Enable result caching
  cacheDir: './cache'          // Cache directory
};
```

## 📊 Output Format

### JSON Structure
```json
{
  "url": "https://example.com",
  "status": "Success",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "loadTime": 2500,
  "content": {
    "title": "Page Title",
    "headings": [
      {
        "level": 1,
        "text": "Main Heading",
        "id": "main-heading",
        "className": "title"
      }
    ],
    "lists": [
      {
        "type": "ul",
        "items": ["Item 1", "Item 2"]
      }
    ],
    "tables": [
      {
        "rows": [["Header 1", "Header 2"], ["Data 1", "Data 2"]]
      }
    ],
    "links": [
      {
        "href": "https://example.com/about",
        "text": "About Us"
      }
    ],
    "mainContent": "Main page content...",
    "metaDescription": "Page description",
    "metaKeywords": "keywords, here"
  },
  "imageTexts": [
    {
      "src": "https://example.com/image.jpg",
      "alt": "Image description",
      "type": "alt-text"
    }
  ],
  "relatedPages": [
    {
      "href": "https://example.com/about",
      "keyword": "about",
      "text": "About Us"
    }
  ],
  "technicalNotes": {
    "userAgent": "Mozilla/5.0...",
    "viewport": { "width": 1920, "height": 1080 },
    "method": "Puppeteer",
    "challenges": [],
    "recommendations": []
  }
}
```

### Text Format
```
Website: https://example.com
Status: Success
Last Updated: 2024-01-15T10:30:00.000Z

MAIN CONTENT:
- Page title: Example Website
- Meta description: This is an example website

HEADINGS:
# Main Heading
## Sub Heading
### Section Heading

BODY TEXT:
Main page content with all the text extracted...

NAVIGATION:
- about: https://example.com/about
- pricing: https://example.com/pricing

TECHNICAL NOTES:
- Loading method: Puppeteer
- Challenges: None
- Recommendations: None
```

### CSV Format
```csv
URL,Status,Title,Meta Description,Main Content Length,Headings Count,Links Count,Load Time (ms)
https://example.com,Success,Example Website,This is an example,1500,5,25,2500
```

## 🔒 Security & Best Practices

### Rate Limiting
- Default 1-3 second delays between requests
- Configurable concurrent request limits
- Respects website load times

### Robots.txt Compliance
- Automatically checks robots.txt
- Can be disabled with `--no-robots` flag
- Respects disallow directives

### Caching
- Results cached for 24 hours by default
- Reduces server load and improves performance
- Can be disabled with `--no-cache` flag

### Error Handling
- Graceful handling of 403, 404, 500 errors
- Automatic retry with exponential backoff
- Clear error reporting with suggestions

## 🚀 Deployment

### Firebase Functions
The scraper is already integrated into your Firebase functions. Deploy with:

```bash
firebase deploy --only functions
```

### Access URLs
- Web Interface: `https://your-project.cloudfunctions.net/api/scraper`
- API Endpoint: `https://your-project.cloudfunctions.net/api/scraper/api/scrape`

### Environment Variables
For production, consider setting these environment variables:
```bash
# Optional: Custom cache directory
SCRAPER_CACHE_DIR=/tmp/scraper-cache

# Optional: Custom timeout
SCRAPER_TIMEOUT=30000
```

## 📝 Examples

### Example 1: Basic Single URL Scraping
```bash
node scraper-cli.js scrape https://example.com
```

### Example 2: Batch Processing with Custom Options
```bash
# Create URLs file
echo "https://example1.com
https://example2.com
https://example3.com" > urls.txt

# Run batch scraping
node scraper-cli.js batch urls.txt --format csv --output results.csv --concurrent 5
```

### Example 3: Programmatic Usage
```javascript
const AdvancedWebScraper = require('./scraper');

async function scrapeWebsite() {
  const scraper = new AdvancedWebScraper({
    headless: true,
    timeout: 30000,
    maxConcurrent: 3
  });

  try {
    const result = await scraper.scrapeUrl('https://example.com');
    
    if (result.status === 'Success') {
      console.log('Title:', result.content.title);
      console.log('Headings:', result.content.headings.length);
      console.log('Links:', result.content.links.length);
    } else {
      console.error('Failed:', result.error);
    }
  } finally {
    await scraper.cleanup();
  }
}

scrapeWebsite();
```

### Example 4: Web Interface Usage
1. Navigate to the web interface
2. Enter URLs (one per line)
3. Configure options (format, concurrent requests, etc.)
4. Click "Start Scraping"
5. View results and download exports

## 🐛 Troubleshooting

### Common Issues

**Puppeteer Installation Issues**
```bash
# On Linux, install additional dependencies
sudo apt-get install -y \
    gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 \
    libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 \
    libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 \
    libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
    libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 \
    libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation \
    libappindicator1 libnss3 lsb-release xdg-utils wget
```

**Memory Issues**
- Reduce `maxConcurrent` setting
- Increase timeout values
- Enable headless mode

**Rate Limiting**
- Increase delay ranges
- Reduce concurrent requests
- Use caching to avoid repeated requests

**CAPTCHA Detection**
- The scraper will pause and notify when CAPTCHA is detected
- Manual intervention may be required
- Consider using different user agents or delays

## 📈 Performance Tips

1. **Use Caching**: Enable caching to avoid repeated requests
2. **Optimize Concurrency**: Balance between speed and server load
3. **Monitor Memory**: Large pages may require more memory
4. **Batch Processing**: Use batch mode for multiple URLs
5. **Error Handling**: Implement proper error handling in your code

## 🔄 Integration with Existing Code

The scraper is designed to be non-destructive and integrates seamlessly with your existing Firebase functions:

- **No Code Changes**: Existing functionality remains unchanged
- **Separate Routes**: Scraper routes are mounted at `/scraper`
- **Independent Operation**: Scraper can be used independently
- **Shared Dependencies**: Uses existing Express and CORS setup

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the error messages in the console
3. Verify your configuration options
4. Test with a simple URL first

## 📄 License

This tool is part of your Retronix project and follows the same licensing terms. 