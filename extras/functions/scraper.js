const puppeteer = require('puppeteer');
const UserAgent = require('user-agents');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('node:crypto');

class AdvancedWebScraper {
  constructor(options = {}) {
    this.options = {
      headless: true,
      timeout: 30000,
      retryAttempts: 3,
      delayRange: [1000, 3000],
      viewportRange: { width: [1200, 1920], height: [800, 1080] },
      respectRobotsTxt: true,
      enableOCR: true,
      maxConcurrent: 3,
      cacheEnabled: true,
      cacheDir: './cache',
      ...options
    };
    
    this.browser = null;
    this.userAgents = this.generateUserAgents();
    this.activeRequests = 0;
    this.requestQueue = [];
  }

  // Generate realistic user agents for rotation
  generateUserAgents() {
    return [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ];
  }

  // Initialize browser with anti-detection measures
  async initializeBrowser() {
    if (this.browser) return this.browser;

    const userAgent = this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
    const viewport = {
      width: Math.floor(Math.random() * (this.options.viewportRange.width[1] - this.options.viewportRange.width[0])) + this.options.viewportRange.width[0],
      height: Math.floor(Math.random() * (this.options.viewportRange.height[1] - this.options.viewportRange.height[0])) + this.options.viewportRange.height[0]
    };

    this.browser = await puppeteer.launch({
      headless: this.options.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection'
      ]
    });

    return this.browser;
  }

  // Random delay to simulate human behavior
  async randomDelay() {
    const delay = Math.floor(Math.random() * (this.options.delayRange[1] - this.options.delayRange[0])) + this.options.delayRange[0];
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  // Simulate human-like mouse movements
  async simulateHumanBehavior(page) {
    // Random scrolling
    await page.evaluate(() => {
      const scrollHeight = Math.random() * 500 + 100;
      window.scrollBy(0, scrollHeight);
    });
    
    await this.randomDelay();
    
    // Random mouse movement
    const viewport = await page.viewport();
    const x = Math.random() * viewport.width;
    const y = Math.random() * viewport.height;
    await page.mouse.move(x, y);
    
    await this.randomDelay();
  }

  // Check robots.txt
  async checkRobotsTxt(url) {
    if (!this.options.respectRobotsTxt) return true;
    
    try {
      const robotsUrl = new URL('/robots.txt', url).href;
      const response = await fetch(robotsUrl);
      const robotsText = await response.text();
      
      // Simple robots.txt parser
      const lines = robotsText.split('\n');
      const userAgent = '*';
      let isAllowed = true;
      
      for (const line of lines) {
        if (line.toLowerCase().startsWith('user-agent:') && line.includes(userAgent)) {
          isAllowed = true;
        } else if (line.toLowerCase().startsWith('disallow:') && isAllowed) {
          const disallowPath = line.split(':')[1].trim();
          if (url.includes(disallowPath)) {
            return false;
          }
        }
      }
      
      return true;
    } catch (error) {
      console.warn('Could not check robots.txt:', error.message);
      return true; // Default to allowed if can't check
    }
  }

  // Extract text content with structure preservation
  async extractContent(page) {
    const content = await page.evaluate(() => {
      const extractText = (element) => {
        const text = element.textContent || '';
        return text.replace(/\s+/g, ' ').trim();
      };

      const extractHeadings = () => {
        const headings = [];
        for (let i = 1; i <= 6; i++) {
          const elements = document.querySelectorAll(`h${i}`);
          elements.forEach(el => {
            headings.push({
              level: i,
              text: extractText(el),
              id: el.id || '',
              className: el.className || ''
            });
          });
        }
        return headings;
      };

      const extractLists = () => {
        const lists = [];
        const ulElements = document.querySelectorAll('ul, ol');
        ulElements.forEach(list => {
          const items = Array.from(list.querySelectorAll('li')).map(li => extractText(li));
          lists.push({
            type: list.tagName.toLowerCase(),
            items: items
          });
        });
        return lists;
      };

      const extractTables = () => {
        const tables = [];
        const tableElements = document.querySelectorAll('table');
        tableElements.forEach(table => {
          const rows = Array.from(table.querySelectorAll('tr')).map(row => {
            return Array.from(row.querySelectorAll('td, th')).map(cell => extractText(cell));
          });
          tables.push({ rows });
        });
        return tables;
      };

      const extractLinks = () => {
        const links = [];
        const linkElements = document.querySelectorAll('a[href]');
        linkElements.forEach(link => {
          const href = link.href;
          const text = extractText(link);
          if (href && text && !href.startsWith('javascript:') && !href.startsWith('#')) {
            links.push({ href, text });
          }
        });
        return links;
      };

      const extractMainContent = () => {
        // Try to find main content area
        const selectors = [
          'main',
          '[role="main"]',
          '.main-content',
          '.content',
          '#content',
          '.post-content',
          '.article-content'
        ];

        let mainElement = null;
        for (const selector of selectors) {
          mainElement = document.querySelector(selector);
          if (mainElement) break;
        }

        if (!mainElement) {
          mainElement = document.body;
        }

        return extractText(mainElement);
      };

      return {
        title: document.title,
        headings: extractHeadings(),
        lists: extractLists(),
        tables: extractTables(),
        links: extractLinks(),
        mainContent: extractMainContent(),
        metaDescription: document.querySelector('meta[name="description"]')?.content || '',
        metaKeywords: document.querySelector('meta[name="keywords"]')?.content || ''
      };
    });

    return content;
  }

  // OCR text from images
  async extractImageText(page) {
    if (!this.options.enableOCR) return [];

    try {
      const imageTexts = await page.evaluate(async () => {
        const images = document.querySelectorAll('img');
        const results = [];

        for (const img of images) {
          if (img.alt && img.alt.trim()) {
            results.push({
              src: img.src,
              alt: img.alt.trim(),
              type: 'alt-text'
            });
          }
        }

        return results;
      });

      return imageTexts;
    } catch (error) {
      console.warn('OCR extraction failed:', error.message);
      return [];
    }
  }

  // Navigate to related pages
  async findRelatedPages(page, baseUrl) {
    const relatedPages = [];
    const importantKeywords = ['about', 'pricing', 'faq', 'contact', 'help', 'support', 'terms', 'privacy'];

    try {
      const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href]')).map(link => ({
          href: link.href,
          text: link.textContent.trim().toLowerCase()
        }));
      });

      for (const link of links) {
        for (const keyword of importantKeywords) {
          if (link.text.includes(keyword) || link.href.toLowerCase().includes(keyword)) {
            if (link.href.startsWith(baseUrl) && !relatedPages.find(p => p.href === link.href)) {
              relatedPages.push({
                href: link.href,
                keyword: keyword,
                text: link.text
              });
            }
          }
        }
      }
    } catch (error) {
      console.warn('Error finding related pages:', error.message);
    }

    return relatedPages.slice(0, 5); // Limit to 5 related pages
  }

  // Cache management
  async getCachedResult(url) {
    if (!this.options.cacheEnabled) return null;

    try {
      const hash = crypto.createHash('md5').update(url).digest('hex');
      const cacheFile = path.join(this.options.cacheDir, `${hash}.json`);
      
      if (await fs.pathExists(cacheFile)) {
        const cached = await fs.readJson(cacheFile);
        const cacheAge = Date.now() - cached.timestamp;
        
        // Cache valid for 24 hours
        if (cacheAge < 24 * 60 * 60 * 1000) {
          return cached.data;
        }
      }
    } catch (error) {
      console.warn('Cache read failed:', error.message);
    }

    return null;
  }

  async setCachedResult(url, data) {
    if (!this.options.cacheEnabled) return;

    try {
      await fs.ensureDir(this.options.cacheDir);
      const hash = crypto.createHash('md5').update(url).digest('hex');
      const cacheFile = path.join(this.options.cacheDir, `${hash}.json`);
      
      await fs.writeJson(cacheFile, {
        url,
        data,
        timestamp: Date.now()
      });
    } catch (error) {
      console.warn('Cache write failed:', error.message);
    }
  }

  // Main scraping method with retry logic
  async scrapeUrl(url, options = {}) {
    const startTime = Date.now();
    let lastError = null;

    // Check cache first
    const cached = await this.getCachedResult(url);
    if (cached) {
      return {
        ...cached,
        cached: true,
        loadTime: Date.now() - startTime
      };
    }

    // Check robots.txt
    const robotsAllowed = await this.checkRobotsTxt(url);
    if (!robotsAllowed) {
      return {
        url,
        status: 'Blocked',
        error: 'Access blocked by robots.txt',
        loadTime: Date.now() - startTime
      };
    }

    for (let attempt = 1; attempt <= this.options.retryAttempts; attempt++) {
      try {
        const browser = await this.initializeBrowser();
        const page = await browser.newPage();

        // Set random user agent
        const userAgent = this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
        await page.setUserAgent(userAgent);

        // Set random viewport
        const viewport = {
          width: Math.floor(Math.random() * (this.options.viewportRange.width[1] - this.options.viewportRange.width[0])) + this.options.viewportRange.width[0],
          height: Math.floor(Math.random() * (this.options.viewportRange.height[1] - this.options.viewportRange.height[0])) + this.options.viewportRange.height[0]
        };
        await page.setViewport(viewport);

        // Set extra headers
        await page.setExtraHTTPHeaders({
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        });

        // Navigate to page
        await page.goto(url, {
          waitUntil: 'networkidle2',
          timeout: this.options.timeout
        });

        // Simulate human behavior
        await this.simulateHumanBehavior(page);

        // Wait for dynamic content
        await page.waitForTimeout(2000);

        // Extract content
        const content = await this.extractContent(page);
        const imageTexts = await this.extractImageText(page);
        const relatedPages = await this.findRelatedPages(page, url);

        // Close page
        await page.close();

        const result = {
          url,
          status: 'Success',
          timestamp: new Date().toISOString(),
          loadTime: Date.now() - startTime,
          content,
          imageTexts,
          relatedPages,
          technicalNotes: {
            userAgent,
            viewport,
            method: 'Puppeteer',
            challenges: [],
            recommendations: []
          }
        };

        // Cache the result
        await this.setCachedResult(url, result);

        return result;

      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed for ${url}:`, error.message);
        
        if (attempt < this.options.retryAttempts) {
          await this.randomDelay();
        }
      }
    }

    return {
      url,
      status: 'Failed',
      error: lastError?.message || 'Unknown error',
      loadTime: Date.now() - startTime,
      technicalNotes: {
        method: 'Puppeteer',
        challenges: [lastError?.message || 'Unknown error'],
        recommendations: ['Check if the website is accessible', 'Try with different user agent', 'Check for rate limiting']
      }
    };
  }

  // Scrape multiple URLs concurrently
  async scrapeMultipleUrls(urls, maxConcurrent = this.options.maxConcurrent) {
    const results = [];
    const chunks = [];

    // Split URLs into chunks
    for (let i = 0; i < urls.length; i += maxConcurrent) {
      chunks.push(urls.slice(i, i + maxConcurrent));
    }

    for (const chunk of chunks) {
      const chunkPromises = chunk.map(url => this.scrapeUrl(url));
      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults);
      
      // Add delay between chunks
      if (chunks.indexOf(chunk) < chunks.length - 1) {
        await this.randomDelay();
      }
    }

    return results;
  }

  // Export results to different formats
  async exportResults(results, format = 'json', outputPath = null) {
    let output = '';

    switch (format.toLowerCase()) {
      case 'json':
        output = JSON.stringify(results, null, 2);
        break;
      
      case 'txt':
        output = this.formatAsText(results);
        break;
      
      case 'csv':
        output = this.formatAsCSV(results);
        break;
      
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    if (outputPath) {
      await fs.ensureDir(path.dirname(outputPath));
      await fs.writeFile(outputPath, output);
      return outputPath;
    }

    return output;
  }

  formatAsText(results) {
    let output = '';
    
    for (const result of results) {
      output += `Website: ${result.url}\n`;
      output += `Status: ${result.status}\n`;
      output += `Last Updated: ${result.timestamp}\n\n`;
      
      if (result.content) {
        output += `MAIN CONTENT:\n`;
        output += `- Page title: ${result.content.title}\n`;
        output += `- Meta description: ${result.content.metaDescription}\n\n`;
        
        if (result.content.headings.length > 0) {
          output += `HEADINGS:\n`;
          result.content.headings.forEach(heading => {
            output += `${'#'.repeat(heading.level)} ${heading.text}\n`;
          });
          output += '\n';
        }
        
        if (result.content.mainContent) {
          output += `BODY TEXT:\n${result.content.mainContent}\n\n`;
        }
      }
      
      if (result.relatedPages && result.relatedPages.length > 0) {
        output += `NAVIGATION:\n`;
        result.relatedPages.forEach(page => {
          output += `- ${page.keyword}: ${page.href}\n`;
        });
        output += '\n';
      }
      
      if (result.technicalNotes) {
        output += `TECHNICAL NOTES:\n`;
        output += `- Loading method: ${result.technicalNotes.method}\n`;
        if (result.technicalNotes.challenges.length > 0) {
          output += `- Challenges: ${result.technicalNotes.challenges.join(', ')}\n`;
        }
        if (result.technicalNotes.recommendations.length > 0) {
          output += `- Recommendations: ${result.technicalNotes.recommendations.join(', ')}\n`;
        }
      }
      
      output += '\n' + '='.repeat(80) + '\n\n';
    }
    
    return output;
  }

  formatAsCSV(results) {
    const headers = ['URL', 'Status', 'Title', 'Meta Description', 'Main Content Length', 'Headings Count', 'Links Count', 'Load Time (ms)'];
    let csv = headers.join(',') + '\n';
    
    for (const result of results) {
      const row = [
        result.url,
        result.status,
        result.content?.title?.replace(/"/g, '""') || '',
        result.content?.metaDescription?.replace(/"/g, '""') || '',
        result.content?.mainContent?.length || 0,
        result.content?.headings?.length || 0,
        result.content?.links?.length || 0,
        result.loadTime || 0
      ];
      
      csv += row.map(field => `"${field}"`).join(',') + '\n';
    }
    
    return csv;
  }

  // Cleanup resources
  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

module.exports = AdvancedWebScraper; 