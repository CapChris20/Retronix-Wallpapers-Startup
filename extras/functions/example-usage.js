const AdvancedWebScraper = require('./scraper');
const fs = require('fs-extra');

// Example 1: Basic single URL scraping
async function basicScraping() {
  console.log('🚀 Example 1: Basic Single URL Scraping');
  console.log('=' .repeat(50));
  
  const scraper = new AdvancedWebScraper();
  
  try {
    const result = await scraper.scrapeUrl('https://example.com');
    
    console.log(`URL: ${result.url}`);
    console.log(`Status: ${result.status}`);
    console.log(`Load Time: ${result.loadTime}ms`);
    
    if (result.status === 'Success') {
      console.log(`Title: ${result.content.title}`);
      console.log(`Headings: ${result.content.headings.length}`);
      console.log(`Links: ${result.content.links.length}`);
      console.log(`Main Content Length: ${result.content.mainContent.length} characters`);
    } else {
      console.log(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error('Scraping failed:', error.message);
  } finally {
    await scraper.cleanup();
  }
  
  console.log('\n');
}

// Example 2: Multiple URLs with custom options
async function multipleUrlsScraping() {
  console.log('🚀 Example 2: Multiple URLs with Custom Options');
  console.log('=' .repeat(50));
  
  const urls = [
    'https://example.com',
    'https://httpbin.org/html',
    'https://httpbin.org/json'
  ];
  
  const scraper = new AdvancedWebScraper({
    headless: true,
    timeout: 15000,
    retryAttempts: 2,
    maxConcurrent: 2,
    delayRange: [2000, 4000],
    cacheEnabled: true
  });
  
  try {
    const results = await scraper.scrapeMultipleUrls(urls);
    
    console.log(`Scraped ${results.length} URLs:`);
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.url} - ${result.status} (${result.loadTime}ms)`);
      if (result.status === 'Success') {
        console.log(`   Title: ${result.content.title}`);
      }
    });
    
    // Export to different formats
    const jsonOutput = await scraper.exportResults(results, 'json');
    const txtOutput = await scraper.exportResults(results, 'txt');
    const csvOutput = await scraper.exportResults(results, 'csv');
    
    console.log('\nExport lengths:');
    console.log(`JSON: ${jsonOutput.length} characters`);
    console.log(`Text: ${txtOutput.length} characters`);
    console.log(`CSV: ${csvOutput.length} characters`);
    
  } catch (error) {
    console.error('Multiple URL scraping failed:', error.message);
  } finally {
    await scraper.cleanup();
  }
  
  console.log('\n');
}

// Example 3: Advanced configuration with error handling
async function advancedScraping() {
  console.log('🚀 Example 3: Advanced Configuration with Error Handling');
  console.log('=' .repeat(50));
  
  const scraper = new AdvancedWebScraper({
    headless: true,
    timeout: 20000,
    retryAttempts: 3,
    delayRange: [1000, 2000],
    viewportRange: { width: [1366, 1920], height: [768, 1080] },
    respectRobotsTxt: false, // For testing purposes
    enableOCR: true,
    maxConcurrent: 1,
    cacheEnabled: false // Disable cache for testing
  });
  
  const testUrls = [
    'https://example.com',
    'https://httpbin.org/status/404', // This will fail
    'https://httpbin.org/delay/5'     // This will timeout
  ];
  
  try {
    for (const url of testUrls) {
      console.log(`\nScraping: ${url}`);
      
      try {
        const result = await scraper.scrapeUrl(url);
        
        console.log(`  Status: ${result.status}`);
        console.log(`  Load Time: ${result.loadTime}ms`);
        
        if (result.status === 'Success') {
          console.log(`  Title: ${result.content.title}`);
          console.log(`  Headings: ${result.content.headings.length}`);
          console.log(`  Related Pages: ${result.relatedPages.length}`);
        } else {
          console.log(`  Error: ${result.error}`);
          if (result.technicalNotes?.recommendations) {
            console.log(`  Recommendations: ${result.technicalNotes.recommendations.join(', ')}`);
          }
        }
      } catch (error) {
        console.log(`  Exception: ${error.message}`);
      }
    }
  } finally {
    await scraper.cleanup();
  }
  
  console.log('\n');
}

// Example 4: Content analysis and filtering
async function contentAnalysis() {
  console.log('🚀 Example 4: Content Analysis and Filtering');
  console.log('=' .repeat(50));
  
  const scraper = new AdvancedWebScraper({
    headless: true,
    timeout: 30000
  });
  
  try {
    const result = await scraper.scrapeUrl('https://example.com');
    
    if (result.status === 'Success') {
      console.log('Content Analysis:');
      console.log(`- Page Title: ${result.content.title}`);
      console.log(`- Meta Description: ${result.content.metaDescription}`);
      console.log(`- Meta Keywords: ${result.content.metaKeywords}`);
      
      console.log('\nHeadings Structure:');
      result.content.headings.forEach(heading => {
        const indent = '  '.repeat(heading.level - 1);
        console.log(`${indent}${'#'.repeat(heading.level)} ${heading.text}`);
      });
      
      console.log('\nLists Found:');
      result.content.lists.forEach((list, index) => {
        console.log(`  List ${index + 1} (${list.type}): ${list.items.length} items`);
        list.items.slice(0, 3).forEach(item => console.log(`    - ${item}`));
        if (list.items.length > 3) console.log(`    ... and ${list.items.length - 3} more`);
      });
      
      console.log('\nTables Found:');
      result.content.tables.forEach((table, index) => {
        console.log(`  Table ${index + 1}: ${table.rows.length} rows`);
        if (table.rows.length > 0) {
          console.log(`    Headers: ${table.rows[0].join(' | ')}`);
        }
      });
      
      console.log('\nImportant Links:');
      const importantKeywords = ['about', 'pricing', 'contact', 'help', 'support'];
      result.content.links.forEach(link => {
        const isImportant = importantKeywords.some(keyword => 
          link.text.toLowerCase().includes(keyword) || 
          link.href.toLowerCase().includes(keyword)
        );
        if (isImportant) {
          console.log(`  - ${link.text}: ${link.href}`);
        }
      });
      
      console.log('\nImage Text:');
      result.imageTexts.forEach(img => {
        console.log(`  - ${img.alt} (${img.src})`);
      });
      
      console.log('\nRelated Pages:');
      result.relatedPages.forEach(page => {
        console.log(`  - ${page.keyword}: ${page.href}`);
      });
      
      console.log('\nTechnical Details:');
      console.log(`  - User Agent: ${result.technicalNotes.userAgent.substring(0, 50)}...`);
      console.log(`  - Viewport: ${result.technicalNotes.viewport.width}x${result.technicalNotes.viewport.height}`);
      console.log(`  - Method: ${result.technicalNotes.method}`);
    }
  } catch (error) {
    console.error('Content analysis failed:', error.message);
  } finally {
    await scraper.cleanup();
  }
  
  console.log('\n');
}

// Example 5: Batch processing with file output
async function batchProcessing() {
  console.log('🚀 Example 5: Batch Processing with File Output');
  console.log('=' .repeat(50));
  
  const urls = [
    'https://example.com',
    'https://httpbin.org/html',
    'https://httpbin.org/json'
  ];
  
  const scraper = new AdvancedWebScraper({
    headless: true,
    maxConcurrent: 2,
    cacheEnabled: true
  });
  
  try {
    console.log(`Starting batch processing of ${urls.length} URLs...`);
    const results = await scraper.scrapeMultipleUrls(urls);
    
    // Save results to files
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // JSON output
    await fs.writeFile(`batch-results-${timestamp}.json`, JSON.stringify(results, null, 2));
    console.log(`✅ JSON results saved to: batch-results-${timestamp}.json`);
    
    // Text output
    const txtOutput = await scraper.exportResults(results, 'txt');
    await fs.writeFile(`batch-results-${timestamp}.txt`, txtOutput);
    console.log(`✅ Text results saved to: batch-results-${timestamp}.txt`);
    
    // CSV output
    const csvOutput = await scraper.exportResults(results, 'csv');
    await fs.writeFile(`batch-results-${timestamp}.csv`, csvOutput);
    console.log(`✅ CSV results saved to: batch-results-${timestamp}.csv`);
    
    // Summary
    const successful = results.filter(r => r.status === 'Success').length;
    const failed = results.filter(r => r.status === 'Failed').length;
    const totalTime = results.reduce((sum, r) => sum + (r.loadTime || 0), 0);
    
    console.log('\nBatch Processing Summary:');
    console.log(`  ✅ Successful: ${successful}`);
    console.log(`  ❌ Failed: ${failed}`);
    console.log(`  ⏱️  Total Time: ${Math.round(totalTime / 1000)}s`);
    
  } catch (error) {
    console.error('Batch processing failed:', error.message);
  } finally {
    await scraper.cleanup();
  }
  
  console.log('\n');
}

// Run all examples
async function runAllExamples() {
  console.log('🌐 Advanced Web Scraper - Usage Examples');
  console.log('=' .repeat(60));
  console.log('This script demonstrates various ways to use the web scraper.\n');
  
  try {
    await basicScraping();
    await multipleUrlsScraping();
    await advancedScraping();
    await contentAnalysis();
    await batchProcessing();
    
    console.log('🎉 All examples completed successfully!');
    console.log('\n📚 For more information, see README-SCRAPER.md');
    
  } catch (error) {
    console.error('❌ Example execution failed:', error.message);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples();
}

module.exports = {
  basicScraping,
  multipleUrlsScraping,
  advancedScraping,
  contentAnalysis,
  batchProcessing,
  runAllExamples
}; 