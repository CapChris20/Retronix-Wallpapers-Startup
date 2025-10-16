// SEO utility functions for generating structured data and meta information

export const generateWallpaperStructuredData = (wallpapers, category = null) => {
  const baseUrl = "https://retronixwallpapers.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category ? `${category} Wallpapers` : "Retronix Wallpapers",
    "description": `Free ${category ? category.toLowerCase() : 'retro and vaporwave'} wallpapers in 4K and HD. Download high-quality nostalgic backgrounds for your devices.`,
    "url": `${baseUrl}/wallpapers${category ? `?category=${category.toLowerCase()}` : ''}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": wallpapers.length,
      "itemListElement": wallpapers.slice(0, 20).map((wallpaper, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "ImageObject",
          "name": wallpaper.title || "Retro Wallpaper",
          "description": `${wallpaper.title || "Retro"} ${wallpaper.category || "vaporwave"} wallpaper in 4K - ${wallpaper.type === 'live' ? 'animated' : 'static'} retro background`,
          "url": wallpaper.download || wallpaper.url,
          "thumbnailUrl": wallpaper.thumbnail || wallpaper.thumb || wallpaper.preview,
          "contentUrl": wallpaper.download || wallpaper.url,
          "encodingFormat": wallpaper.type === 'live' ? "video/mp4" : "image/jpeg",
          "width": "3840",
          "height": "2160",
          "keywords": [
            "retrowave",
            "vaporwave", 
            "retro",
            "80s",
            "synthwave",
            wallpaper.category?.toLowerCase() || "misc",
            "4K",
            "HD",
            "wallpaper",
            "background"
          ].filter(Boolean),
          "license": "https://creativecommons.org/licenses/by/4.0/",
          "creator": {
            "@type": "Organization",
            "name": "Retronix",
            "url": baseUrl
          }
        }
      }))
    },
    "provider": {
      "@type": "Organization",
      "name": "Retronix",
      "url": baseUrl,
      "logo": `${baseUrl}/brand-logo.PNG`,
      "sameAs": [
        "https://twitter.com/retronix",
        "https://instagram.com/retronix"
      ]
    }
  };
};

export const generateCategoryStructuredData = (category, wallpapers) => {
  const baseUrl = "https://retronixwallpapers.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category} Wallpapers - Retronix`,
    "description": `Download free ${category.toLowerCase()} wallpapers in 4K and HD. High-quality retro and vaporwave backgrounds for your devices.`,
    "url": `${baseUrl}/wallpapers?category=${category.toLowerCase()}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": wallpapers.length,
      "itemListElement": wallpapers.slice(0, 10).map((wallpaper, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "ImageObject",
          "name": wallpaper.title || `${category} Wallpaper`,
          "description": `${wallpaper.title || category} ${category.toLowerCase()} wallpaper in 4K - ${wallpaper.type === 'live' ? 'animated' : 'static'} retro background`,
          "url": wallpaper.download || wallpaper.url,
          "thumbnailUrl": wallpaper.thumbnail || wallpaper.thumb || wallpaper.preview,
          "contentUrl": wallpaper.download || wallpaper.url,
          "encodingFormat": wallpaper.type === 'live' ? "video/mp4" : "image/jpeg",
          "width": "3840",
          "height": "2160"
        }
      }))
    }
  };
};

export const generateHomepageStructuredData = () => {
  const baseUrl = "https://retronixwallpapers.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Retronix Wallpapers",
    "description": "Free Retronix-inspired retro & vaporwave wallpapers in 4K and HD. Updated weekly with nostalgic retrowave designs.",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/wallpapers?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://twitter.com/retronix",
      "https://instagram.com/retronix"
    ],
    "publisher": {
      "@type": "Organization",
      "name": "Retronix",
      "url": baseUrl,
      "logo": `${baseUrl}/brand-logo.PNG`,
      "foundingDate": "2024"
    }
  };
};

export const generateWallpaperAltText = (wallpaper) => {
  const title = wallpaper.title || "Retro";
  const category = wallpaper.category || "vaporwave";
  const type = wallpaper.type === 'live' ? 'animated' : 'static';
  
  return `${title} ${category} wallpaper in 4K - ${type} retro background for desktop and mobile devices`;
};

export const generatePageTitle = (page, category = null, wallpaperTitle = null) => {
  const baseTitle = "Retronix Wallpapers";
  
  if (wallpaperTitle) {
    return `${wallpaperTitle} | ${baseTitle}`;
  }
  
  if (category) {
    return `${category} Wallpapers | ${baseTitle}`;
  }
  
  switch (page) {
    case 'home':
      return `${baseTitle} | Free Retro & Vaporwave Wallpapers in 4K`;
    case 'wallpapers':
      return `Free Wallpapers | ${baseTitle}`;
    case 'about':
      return `About Us | ${baseTitle}`;
    case 'contact':
      return `Contact Us | ${baseTitle}`;
    case 'pricing':
      return `Pricing Plans | ${baseTitle}`;
    case 'faq':
      return `Frequently Asked Questions | ${baseTitle}`;
    case 'instructions':
      return `How to Set Up Wallpapers | ${baseTitle}`;
    case 'privacy':
      return `Privacy Policy | ${baseTitle}`;
    case 'terms':
      return `Terms of Service | ${baseTitle}`;
    default:
      return baseTitle;
  }
};

export const generatePageDescription = (page, category = null, wallpaperCount = null) => {
  const baseDescription = "Download free Retronix-inspired retro & vaporwave wallpapers in 4K and HD. Updated weekly with nostalgic retrowave designs.";
  
  if (category) {
    return `Download free ${category.toLowerCase()} wallpapers in 4K and HD. High-quality retro and vaporwave backgrounds for your devices. ${wallpaperCount ? `Browse ${wallpaperCount}+ ${category.toLowerCase()} wallpapers.` : ''}`;
  }
  
  switch (page) {
    case 'home':
      return baseDescription;
    case 'wallpapers':
      return `Browse our collection of free retro and vaporwave wallpapers. Download high-quality 4K and HD backgrounds for desktop and mobile devices.`;
    case 'about':
      return `Learn about Retronix - your source for premium retro and vaporwave wallpapers. Discover our mission to bring nostalgic aesthetics to modern devices.`;
    case 'contact':
      return `Get in touch with the Retronix team. We'd love to hear from you about our wallpaper collection or any questions you may have.`;
    case 'pricing':
      return `Choose the perfect plan for your wallpaper needs. Free and premium options available for static and live wallpapers.`;
    case 'faq':
      return `Find answers to common questions about Retronix wallpapers, installation, and our services.`;
    case 'instructions':
      return `Learn how to set up and use Retronix wallpapers on your Mac, Windows, or mobile device. Step-by-step installation guides.`;
    case 'privacy':
      return `Read our privacy policy to understand how we collect, use, and protect your personal information.`;
    case 'terms':
      return `Review our terms of service for using Retronix wallpapers and our website.`;
    default:
      return baseDescription;
  }
};

export const generateKeywords = (page, category = null) => {
  const baseKeywords = [
    "retrowave wallpapers",
    "vaporwave wallpapers", 
    "retro backgrounds",
    "nostalgic wallpapers",
    "80s retro wallpapers",
    "Retronix",
    "4K wallpapers",
    "HD wallpapers",
    "retro aesthetic",
    "synthwave backgrounds"
  ];
  
  if (category) {
    return [
      ...baseKeywords,
      `${category.toLowerCase()} wallpapers`,
      `${category.toLowerCase()} backgrounds`,
      `${category.toLowerCase()} aesthetic`
    ];
  }
  
  switch (page) {
    case 'wallpapers':
      return [...baseKeywords, "free wallpapers", "download wallpapers", "desktop backgrounds"];
    case 'about':
      return [...baseKeywords, "about retronix", "retro wallpaper company", "vaporwave art"];
    case 'pricing':
      return [...baseKeywords, "wallpaper pricing", "premium wallpapers", "subscription plans"];
    default:
      return baseKeywords;
  }
};

