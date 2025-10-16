import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  structuredData,
  canonicalUrl
}) => {
  const siteName = "Retronix Wallpapers";
  const siteUrl = "https://retronixwallpapers.com";
  const defaultImage = "/og-image.jpg";
  
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | Free Retro & Vaporwave Wallpapers in 4K`;
  const fullDescription = description || "Download free Retronix-inspired retro & vaporwave wallpapers in 4K and HD. Updated weekly with nostalgic retrowave designs.";
  const fullImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}${defaultImage}`;
  const fullUrl = url ? (url.startsWith('http') ? url : `${siteUrl}${url}`) : siteUrl;
  const fullCanonicalUrl = canonicalUrl || fullUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywords || "retrowave wallpapers, vaporwave wallpapers, retro backgrounds, nostalgic wallpapers, 80s retro wallpapers, Retronix, 4K wallpapers, HD wallpapers, retro aesthetic, synthwave backgrounds"} />
      <meta name="author" content="Retronix" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:creator" content="@retronix" />
      <meta name="twitter:site" content="@retronix" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#ff00cc" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Retronix" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;

