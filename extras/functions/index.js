require('dotenv').config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

admin.initializeApp();
const db = admin.firestore();

const products = {
  "Static Pro": {
    priceId: "price_1RnYhLHkDkOMe7fvjp1VLklz",
  },
  "Live Pro": {
    priceId: "price_1RnYi1HkDkOMe7fvTAGHmVRL",
  },
  "Premium Pro": {
    priceId: "price_1RnYjoHkDkOMe7fvXAHkIMym",
  },
};

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Import and use the web scraper routes
const scraperRoutes = require('./scraper-web');
app.use('/scraper', scraperRoutes);

// === AI Site Information Endpoint ===
app.get("/api/site-info", async (req, res) => {
  try {
    // Use Puppeteer to handle JavaScript-rendered content
    const puppeteer = require('puppeteer');
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // Scrape ALL pages from your site
    const pages = [
      { path: '/', name: 'home' },
      { path: '/about', name: 'about' },
      { path: '/pricing', name: 'pricing' },
      { path: '/faq', name: 'faq' },
      { path: '/contact', name: 'contact' },
      { path: '/wallpapers', name: 'wallpapers' },
      { path: '/terms', name: 'terms' },
      { path: '/privacy', name: 'privacy' },
      { path: '/instructions', name: 'instructions' }
    ];
    
    const scrapedData = {};
    
    for (const page of pages) {
      try {
        const pageInstance = await browser.newPage();
        await pageInstance.goto(`https://retronixwallpapers.com${page.path}`, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });
        
        // Wait for content to load - use a more reliable method
        await pageInstance.waitForFunction(() => {
          return document.body.innerText.length > 100;
        }, { timeout: 10000 });
        
        // Extract comprehensive content
        const pageData = await pageInstance.evaluate(() => {
          const title = document.title;
          const content = document.body.innerText;
          const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
            .map(h => ({ level: h.tagName[1], text: h.innerText.trim() }));
          
          // Extract prices
          const prices = Array.from(document.querySelectorAll('*'))
            .map(el => el.innerText.match(/\$\d+(?:\.\d{2})?/g))
            .flat()
            .filter(Boolean);
          
          // Extract FAQ questions and answers
          const faqItems = Array.from(document.querySelectorAll('.faqs-card, .question, .answer'))
            .map(el => el.innerText.trim())
            .filter(text => text.length > 10);
          
          // Extract contact info
          const emails = Array.from(document.querySelectorAll('*'))
            .map(el => el.innerText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g))
            .flat()
            .filter(Boolean);
          
          // Extract links
          const links = Array.from(document.querySelectorAll('a[href]'))
            .map(a => ({ href: a.href, text: a.innerText.trim() }))
            .filter(link => link.text.length > 0);
          
          return { 
            title, 
            content, 
            headings, 
            prices, 
            faqItems, 
            emails, 
            links,
            contentLength: content.length
          };
        });
        
        scrapedData[page.name] = pageData;
        await pageInstance.close();
        
      } catch (error) {
        console.error(`Error scraping ${page.name}:`, error.message);
        scrapedData[page.name] = { error: error.message };
      }
    }
    
    await browser.close();
    
    // Extract comprehensive information from all pages
    const extractPricingInfo = (pricingData) => {
      if (!pricingData.content) return {};
      
      const content = pricingData.content.toLowerCase();
      const prices = pricingData.prices || [];
      const planMatches = content.match(/(static|live|premium)\s*(pro|plan|tier)/gi) || [];
      
      const features = [];
      if (content.includes('hd')) features.push('HD Wallpapers');
      if (content.includes('4k')) features.push('4K Wallpapers');
      if (content.includes('8k')) features.push('8K Wallpapers');
      if (content.includes('live')) features.push('Live Wallpapers');
      if (content.includes('unlimited')) features.push('Unlimited Downloads');
      if (content.includes('download')) features.push('Download Access');
      if (content.includes('support')) features.push('Support');
      
      return { prices, planMatches, features };
    };
    
    const extractFAQInfo = (faqData) => {
      if (!faqData.faqItems) return [];
      
      // Group questions and answers
      const faqs = [];
      for (let i = 0; i < faqData.faqItems.length; i += 2) {
        if (faqData.faqItems[i + 1]) {
          faqs.push({
            question: faqData.faqItems[i],
            answer: faqData.faqItems[i + 1]
          });
        }
      }
      return faqs;
    };
    
    // Build comprehensive site information
    const siteInfo = {
      siteName: scrapedData.home?.title || "Retronix Wallpapers",
      url: "https://retronixwallpapers.com",
      lastUpdated: new Date().toISOString(),
      
      // Home page info
      home: {
        title: scrapedData.home?.title,
        content: scrapedData.home?.content?.substring(0, 1000),
        headings: scrapedData.home?.headings || [],
        contentLength: scrapedData.home?.contentLength || 0
      },
      
      // About page info
      about: {
        title: scrapedData.about?.title,
        content: scrapedData.about?.content?.substring(0, 1000),
        headings: scrapedData.about?.headings || [],
        creator: scrapedData.about?.content?.includes('Chris Shina') ? 'Chris Shina' : null,
        contentLength: scrapedData.about?.contentLength || 0
      },
      
      // Pricing info
      pricing: {
        title: scrapedData.pricing?.title,
        content: scrapedData.pricing?.content?.substring(0, 1000),
        headings: scrapedData.pricing?.headings || [],
        ...extractPricingInfo(scrapedData.pricing),
        contentLength: scrapedData.pricing?.contentLength || 0
      },
      
      // FAQ info
      faq: {
        title: scrapedData.faq?.title,
        content: scrapedData.faq?.content?.substring(0, 1000),
        headings: scrapedData.faq?.headings || [],
        faqs: extractFAQInfo(scrapedData.faq),
        contentLength: scrapedData.faq?.contentLength || 0
      },
      
      // Contact info
      contact: {
        title: scrapedData.contact?.title,
        content: scrapedData.contact?.content?.substring(0, 500),
        emails: scrapedData.contact?.emails || [],
        contentLength: scrapedData.contact?.contentLength || 0
      },
      
      // Wallpapers page
      wallpapers: {
        title: scrapedData.wallpapers?.title,
        content: scrapedData.wallpapers?.content?.substring(0, 500),
        headings: scrapedData.wallpapers?.headings || [],
        contentLength: scrapedData.wallpapers?.contentLength || 0
      },
      
      // Terms and Privacy
      terms: {
        title: scrapedData.terms?.title,
        content: scrapedData.terms?.content?.substring(0, 500),
        contentLength: scrapedData.terms?.contentLength || 0
      },
      
      privacy: {
        title: scrapedData.privacy?.title,
        content: scrapedData.privacy?.content?.substring(0, 500),
        contentLength: scrapedData.privacy?.contentLength || 0
      },
      
      // Instructions
      instructions: {
        title: scrapedData.instructions?.title,
        content: scrapedData.instructions?.content?.substring(0, 500),
        contentLength: scrapedData.instructions?.contentLength || 0
      },
      
      // Scraping status
      scrapingStatus: {
        totalPages: pages.length,
        successfulPages: Object.keys(scrapedData).filter(key => !scrapedData[key].error).length,
        failedPages: Object.keys(scrapedData).filter(key => scrapedData[key].error).length,
        method: "Puppeteer browser automation - All pages"
      }
    };

    res.json({
      success: true,
      data: siteInfo,
      timestamp: new Date().toISOString(),
      note: "This data was scraped from ALL pages of your website using browser automation to handle JavaScript"
    });
    
  } catch (error) {
    console.error("Site info error:", error);
    res.status(500).json({ 
      error: "Failed to get site information: " + error.message,
      success: false 
    });
  }
});

// === Create Checkout Session ===
app.post("/create-checkout-session", async (req, res) => {
  const { uid, tier } = req.body;

  if (!uid || !tier) {
    return res.status(400).json({ error: "Missing uid or tier" });
  }

  const product = products[tier];
  if (!product) {
    return res.status(400).json({ error: "Invalid tier name" });
  }

  const donationInfo = "60% of this purchase will be donated to Gaza humanitarian aid";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: product.priceId,
          quantity: 1,
        },
      ],
      metadata: {
        uid,
        tier,
        donationInfo: "60% of this purchase will be donated to Gaza humanitarian aid"
      },
      custom_text: {
        submit: {
          message: "60% of your purchase will be donated to humanitarian aid in Gaza.",
        },
        terms_of_service_acceptance: {
          message: "60% of your purchase will be donated to humanitarian aid in Gaza.",
        },
      },
      payment_method_collection: "always",
      allow_promotion_codes: false,
      billing_address_collection: "required",
      link: {
        enabled: false
      },
      payment_method_options: {
        card: {
          request_three_d_secure: "automatic"
        }
      },
      automatic_tax: {
        enabled: false
      },
      customer_creation: "always",
      success_url: "https://retronixwallpapers.com/wallpapers",
      cancel_url: "https://retronixwallpapers.com/pricing",
    });

    console.log("✅ Checkout session created:", session.id);
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe error:", err.message);
    return res.status(500).json({ error: "Stripe error: " + err.message });
  }
});

// === Get Monthly Donation Total ===
app.get("/api/monthly-donations", async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);
    
    console.log(`📊 Getting donations for ${currentMonth}`);
    
    // Query donations for current month
    const donationsSnapshot = await db.collection("gaza_donations")
      .where("timestamp", ">=", startOfMonth)
      .where("timestamp", "<=", endOfMonth)
      .get();
    
    let totalDonations = 0;
    let totalRevenue = 0;
    
    donationsSnapshot.forEach(doc => {
      const data = doc.data();
      totalDonations += data.donationAmount || 0;
      totalRevenue += data.totalAmount || 0;
    });
    
    console.log(`✅ Monthly totals: $${totalDonations.toFixed(2)} donations, $${totalRevenue.toFixed(2)} revenue`);
    
    res.json({
      success: true,
      month: currentMonth,
      totalDonations: parseFloat(totalDonations.toFixed(2)),
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      donationCount: donationsSnapshot.size
    });
    
  } catch (error) {
    console.error("❌ Monthly donations error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to get monthly donations: " + error.message 
    });
  }
});

// === Export Express app as Firebase function ===
exports.api = functions.https.onRequest(app);

// === Stripe Webhook Handler ===
exports.handleStripeWebhook = functions.https.onRequest((req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("✅ Webhook received:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const uid = session.metadata?.uid;
    const tier = session.metadata?.tier;
    const donationInfo = session.metadata?.donationInfo || "";

    if (!uid || !tier) {
      console.warn("⚠️ Missing metadata on session");
      return res.status(400).send("Missing metadata");
    }

    const totalAmount = session.amount_total / 100; // in dollars
    const donationAmount = parseFloat((totalAmount * 0.6).toFixed(2)); // 60%

    // Firestore updates: user subscription + Gaza donation log
    const userDoc = db.collection("users").doc(uid).set(
      {
        tier,
        subscription: "active",
        stripeCustomerId: session.customer,
        stripeSessionId: session.id,
        lastPurchase: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    const donationDoc = db.collection("gaza_donations").add({
      uid,
      tier,
      stripeSessionId: session.id,
      totalAmount,
      donationAmount,
      donationInfo,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      forwarded: false, // Mark as true manually after sending
    });

    Promise.all([userDoc, donationDoc])
      .then(() => {
        console.log(`✅ Firestore updated for user: ${uid} with $${donationAmount} donation`);
        res.status(200).send("Webhook handled");
      })
      .catch((err) => {
        console.error("❌ Firestore write failed:", err.message);
        res.status(500).send("Firestore write failed");
      });
  } else {
    res.status(200).send("Unhandled event type");
  }
});