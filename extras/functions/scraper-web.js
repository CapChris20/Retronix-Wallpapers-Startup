const express = require('express');
const AdvancedWebScraper = require('./scraper');
const path = require('path');
const fs = require('fs-extra');

const router = express.Router();

// Serve the web interface HTML
router.get('/', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advanced Web Scraper</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
        }
        
        .form-group {
            margin-bottom: 25px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
        }
        
        input[type="url"], textarea, select {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            font-size: 16px;
            transition: border-color 0.3s ease;
        }
        
        input[type="url"]:focus, textarea:focus, select:focus {
            outline: none;
            border-color: #667eea;
        }
        
        textarea {
            min-height: 120px;
            resize: vertical;
        }
        
        .options-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .option-group {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #e1e5e9;
        }
        
        .option-group h3 {
            margin-bottom: 15px;
            color: #333;
            font-size: 1.1rem;
        }
        
        .checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .checkbox-group input[type="checkbox"] {
            margin-right: 10px;
            transform: scale(1.2);
        }
        
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease;
            margin-right: 15px;
        }
        
        .btn:hover {
            transform: translateY(-2px);
        }
        
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .btn-secondary {
            background: #6c757d;
        }
        
        .results {
            margin-top: 30px;
            display: none;
        }
        
        .results.show {
            display: block;
        }
        
        .result-item {
            background: #f8f9fa;
            border: 1px solid #e1e5e9;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .result-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .status {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status.success {
            background: #d4edda;
            color: #155724;
        }
        
        .status.failed {
            background: #f8d7da;
            color: #721c24;
        }
        
        .status.blocked {
            background: #fff3cd;
            color: #856404;
        }
        
        .result-url {
            font-weight: 600;
            color: #667eea;
            word-break: break-all;
        }
        
        .result-content {
            margin-top: 15px;
        }
        
        .result-content h4 {
            margin-bottom: 10px;
            color: #333;
        }
        
        .result-content p {
            color: #666;
            line-height: 1.6;
        }
        
        .loading {
            text-align: center;
            padding: 40px;
            display: none;
        }
        
        .loading.show {
            display: block;
        }
        
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            display: none;
        }
        
        .error.show {
            display: block;
        }
        
        .summary {
            background: #e7f3ff;
            border: 1px solid #b3d9ff;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            display: none;
        }
        
        .summary.show {
            display: block;
        }
        
        .summary h3 {
            margin-bottom: 15px;
            color: #0056b3;
        }
        
        .summary-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }
        
        .stat {
            text-align: center;
            padding: 15px;
            background: white;
            border-radius: 8px;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: #667eea;
        }
        
        .stat-label {
            font-size: 0.9rem;
            color: #666;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌐 Advanced Web Scraper</h1>
            <p>Extract content from any website with advanced anti-detection capabilities</p>
        </div>
        
        <div class="content">
            <form id="scraperForm">
                <div class="form-group">
                    <label for="urls">URLs to Scrape:</label>
                    <textarea id="urls" name="urls" placeholder="Enter URLs (one per line)&#10;Example:&#10;https://example.com&#10;https://example.org" required></textarea>
                </div>
                
                <div class="options-grid">
                    <div class="option-group">
                        <h3>Output Options</h3>
                        <div class="form-group">
                            <label for="format">Output Format:</label>
                            <select id="format" name="format">
                                <option value="json">JSON</option>
                                <option value="txt">Text</option>
                                <option value="csv">CSV</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="option-group">
                        <h3>Performance</h3>
                        <div class="form-group">
                            <label for="concurrent">Max Concurrent Requests:</label>
                            <select id="concurrent" name="concurrent">
                                <option value="1">1</option>
                                <option value="3" selected>3</option>
                                <option value="5">5</option>
                                <option value="10">10</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="timeout">Timeout (seconds):</label>
                            <select id="timeout" name="timeout">
                                <option value="15">15</option>
                                <option value="30" selected>30</option>
                                <option value="60">60</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="option-group">
                        <h3>Advanced Options</h3>
                        <div class="checkbox-group">
                            <input type="checkbox" id="headless" name="headless" checked>
                            <label for="headless">Headless Mode</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="checkbox" id="cache" name="cache" checked>
                            <label for="cache">Enable Caching</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="checkbox" id="robots" name="robots" checked>
                            <label for="robots">Respect robots.txt</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="checkbox" id="ocr" name="ocr" checked>
                            <label for="ocr">Extract Image Text</label>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <button type="submit" class="btn" id="submitBtn">🚀 Start Scraping</button>
                    <button type="button" class="btn btn-secondary" id="clearBtn">🗑️ Clear Results</button>
                </div>
            </form>
            
            <div class="error" id="error"></div>
            
            <div class="loading" id="loading">
                <div class="spinner"></div>
                <p>Scraping websites... This may take a few moments.</p>
            </div>
            
            <div class="summary" id="summary">
                <h3>📊 Scraping Summary</h3>
                <div class="summary-stats" id="summaryStats"></div>
            </div>
            
            <div class="results" id="results"></div>
        </div>
    </div>
    
    <script>
        const form = document.getElementById('scraperForm');
        const loading = document.getElementById('loading');
        const results = document.getElementById('results');
        const error = document.getElementById('error');
        const summary = document.getElementById('summary');
        const submitBtn = document.getElementById('submitBtn');
        const clearBtn = document.getElementById('clearBtn');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const urls = formData.get('urls').split('\\n').filter(url => url.trim());
            
            if (urls.length === 0) {
                showError('Please enter at least one URL');
                return;
            }
            
            const options = {
                urls: urls,
                format: formData.get('format'),
                maxConcurrent: parseInt(formData.get('concurrent')),
                timeout: parseInt(formData.get('timeout')) * 1000,
                headless: formData.get('headless') === 'on',
                cacheEnabled: formData.get('cache') === 'on',
                respectRobotsTxt: formData.get('robots') === 'on',
                enableOCR: formData.get('ocr') === 'on'
            };
            
            startScraping(options);
        });
        
        clearBtn.addEventListener('click', () => {
            results.innerHTML = '';
            results.classList.remove('show');
            summary.classList.remove('show');
            error.classList.remove('show');
        });
        
        async function startScraping(options) {
            showLoading(true);
            hideError();
            hideResults();
            
            try {
                const response = await fetch('/api/scrape', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(options)
                });
                
                if (!response.ok) {
                    throw new Error('Scraping failed');
                }
                
                const data = await response.json();
                displayResults(data);
                
            } catch (err) {
                showError('Scraping failed: ' + err.message);
            } finally {
                showLoading(false);
            }
        }
        
        function displayResults(data) {
            const resultsContainer = document.getElementById('results');
            const summaryContainer = document.getElementById('summary');
            const summaryStats = document.getElementById('summaryStats');
            
            // Display summary
            const successful = data.results.filter(r => r.status === 'Success').length;
            const failed = data.results.filter(r => r.status === 'Failed').length;
            const blocked = data.results.filter(r => r.status === 'Blocked').length;
            const cached = data.results.filter(r => r.cached).length;
            const totalTime = data.results.reduce((sum, r) => sum + (r.loadTime || 0), 0);
            
            summaryStats.innerHTML = \`
                <div class="stat">
                    <div class="stat-number">\${successful}</div>
                    <div class="stat-label">Successful</div>
                </div>
                <div class="stat">
                    <div class="stat-number">\${failed}</div>
                    <div class="stat-label">Failed</div>
                </div>
                <div class="stat">
                    <div class="stat-number">\${blocked}</div>
                    <div class="stat-label">Blocked</div>
                </div>
                <div class="stat">
                    <div class="stat-number">\${cached}</div>
                    <div class="stat-label">Cached</div>
                </div>
                <div class="stat">
                    <div class="stat-number">\${Math.round(totalTime / 1000)}s</div>
                    <div class="stat-label">Total Time</div>
                </div>
            \`;
            
            summary.classList.add('show');
            
            // Display individual results
            resultsContainer.innerHTML = '';
            data.results.forEach(result => {
                const resultElement = createResultElement(result);
                resultsContainer.appendChild(resultElement);
            });
            
            results.classList.add('show');
        }
        
        function createResultElement(result) {
            const div = document.createElement('div');
            div.className = 'result-item';
            
            const statusClass = result.status.toLowerCase();
            const statusText = result.status;
            
            div.innerHTML = \`
                <div class="result-header">
                    <div class="result-url">\${result.url}</div>
                    <span class="status \${statusClass}">\${statusText}</span>
                </div>
                <div class="result-content">
                    \${result.status === 'Success' ? \`
                        <h4>Page Title</h4>
                        <p>\${result.content?.title || 'No title found'}</p>
                        
                        <h4>Meta Description</h4>
                        <p>\${result.content?.metaDescription || 'No description found'}</p>
                        
                        <h4>Content Summary</h4>
                        <p>\${result.content?.mainContent ? result.content.mainContent.substring(0, 200) + '...' : 'No content found'}</p>
                        
                        <h4>Statistics</h4>
                        <p>Headings: \${result.content?.headings?.length || 0} | Links: \${result.content?.links?.length || 0} | Load Time: \${result.loadTime || 0}ms</p>
                    \` : \`
                        <p><strong>Error:</strong> \${result.error || 'Unknown error'}</p>
                    \`}
                </div>
            \`;
            
            return div;
        }
        
        function showLoading(show) {
            if (show) {
                loading.classList.add('show');
                submitBtn.disabled = true;
            } else {
                loading.classList.remove('show');
                submitBtn.disabled = false;
            }
        }
        
        function showError(message) {
            error.textContent = message;
            error.classList.add('show');
        }
        
        function hideError() {
            error.classList.remove('show');
        }
        
        function hideResults() {
            results.classList.remove('show');
            summary.classList.remove('show');
        }
    </script>
</body>
</html>
  `;
  
  res.send(html);
});

// API endpoint for scraping
router.post('/api/scrape', async (req, res) => {
  try {
    const { urls, ...options } = req.body;
    
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one URL' });
    }
    
    // Validate URLs
    const validUrls = urls.filter(url => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });
    
    if (validUrls.length === 0) {
      return res.status(400).json({ error: 'No valid URLs provided' });
    }
    
    // Create scraper instance
    const scraper = new AdvancedWebScraper({
      headless: options.headless !== false,
      timeout: options.timeout || 30000,
      retryAttempts: 3,
      delayRange: [1000, 3000],
      respectRobotsTxt: options.respectRobotsTxt !== false,
      enableOCR: options.enableOCR !== false,
      maxConcurrent: options.maxConcurrent || 3,
      cacheEnabled: options.cacheEnabled !== false
    });
    
    // Perform scraping
    let results;
    if (validUrls.length === 1) {
      results = [await scraper.scrapeUrl(validUrls[0])];
    } else {
      results = await scraper.scrapeMultipleUrls(validUrls, options.maxConcurrent || 3);
    }
    
    // Export results if format is specified
    let exportedData = null;
    if (options.format && options.format !== 'json') {
      exportedData = await scraper.exportResults(results, options.format);
    }
    
    // Cleanup
    await scraper.cleanup();
    
    res.json({
      success: true,
      results,
      exportedData,
      summary: {
        total: results.length,
        successful: results.filter(r => r.status === 'Success').length,
        failed: results.filter(r => r.status === 'Failed').length,
        blocked: results.filter(r => r.status === 'Blocked').length,
        cached: results.filter(r => r.cached).length
      }
    });
    
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ 
      error: 'Scraping failed: ' + error.message,
      success: false 
    });
  }
});

module.exports = router; 