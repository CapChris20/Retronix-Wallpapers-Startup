#!/usr/bin/env node

/**
 * Script to add SEO optimization to all remaining pages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, '../src/pages');
const PAGES_TO_UPDATE = [
  'Contact.jsx',
  'FAQ.jsx', 
  'Pricing.jsx',
  'Instructions.jsx',
  'Privacy.jsx',
  'Terms.jsx'
];

const SEO_IMPORTS = `import SEOHead from "../components/SEOHead";
import { generatePageTitle, generatePageDescription, generateKeywords } from "../utils/seoUtils";`;

const SEO_COMPONENT = (pageName) => `      <SEOHead
        title={generatePageTitle('${pageName.toLowerCase()}')}
        description={generatePageDescription('${pageName.toLowerCase()}')}
        keywords={generateKeywords('${pageName.toLowerCase()}')}
        url="/${pageName.toLowerCase()}"
      />`;

function addSEOToPage(filePath, pageName) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if SEO is already added
    if (content.includes('SEOHead')) {
      console.log(`✅ ${pageName} already has SEO optimization`);
      return;
    }
    
    // Add imports after React import
    const reactImportRegex = /import React[^;]+;/;
    const reactImportMatch = content.match(reactImportRegex);
    
    if (reactImportMatch) {
      content = content.replace(
        reactImportMatch[0],
        `${reactImportMatch[0]}\n${SEO_IMPORTS}`
      );
    } else {
      // If no React import found, add at the top
      content = `${SEO_IMPORTS}\n\n${content}`;
    }
    
    // Add SEO component after the opening div/container
    const openingDivRegex = /(<div[^>]*className="[^"]*"[^>]*>)/;
    const openingDivMatch = content.match(openingDivRegex);
    
    if (openingDivMatch) {
      content = content.replace(
        openingDivMatch[0],
        `${openingDivMatch[0]}\n${SEO_COMPONENT(pageName)}`
      );
    } else {
      // If no opening div found, add after function declaration
      const functionRegex = /(function \w+\(\) \{\s*return)/;
      content = content.replace(
        functionRegex,
        `$1\n${SEO_COMPONENT(pageName)}`
      );
    }
    
    // Write back to file
    fs.writeFileSync(filePath, content);
    console.log(`✅ Added SEO optimization to ${pageName}`);
    
  } catch (error) {
    console.error(`❌ Error updating ${pageName}:`, error.message);
  }
}

function main() {
  console.log('🚀 Adding SEO optimization to all pages...\n');
  
  PAGES_TO_UPDATE.forEach(pageName => {
    const filePath = path.join(PAGES_DIR, pageName);
    
    if (fs.existsSync(filePath)) {
      addSEOToPage(filePath, pageName.replace('.jsx', ''));
    } else {
      console.log(`⚠️  File not found: ${pageName}`);
    }
  });
  
  console.log('\n🎉 SEO optimization complete!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { addSEOToPage };
