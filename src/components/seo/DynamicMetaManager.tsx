import React, { useEffect, useState } from 'react';
import { Astrologer } from '../../types/astrology.ts';
import {
  Search,
  Share2,
  Check,
  Copy,
  ExternalLink,
  Code2,
  Eye,
  Sparkles,
  ShieldCheck,
  X,
} from 'lucide-react';

export interface TabMetaConfig {
  title: string;
  description: string;
  keywords: string;
  ogType: string;
  ogImage?: string;
  schemaType: string;
  getSchema: (baseUrl: string, appName: string) => object;
}

export const TAB_SEO_CONFIGS: Record<string, TabMetaConfig> = {
  astrologers: {
    title: 'Consult Top Verified Astrologers Online (Live Call & Chat) | 12Rashi',
    description:
      "Connect live with India's certified Vedic astrologers, tarot readers, numerologists, and KP experts. Transparent per-second fair billing & instant call.",
    keywords:
      'online astrology consultation, live astrologer call, talk to astrologer, chat with astrologer, vedic jyotish master, kp astrology, 12rashi',
    ogType: 'website',
    schemaType: 'CollectionPage',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Verified Astrologers Directory – 12Rashi',
      url: `${baseUrl}/?tab=astrologers`,
      description:
        "Browse verified Acharyas, Jyotish Grandmasters, and Tarot Readers available for live audio, video, and chat consultations.",
      provider: {
        '@type': 'Organization',
        name: '12Rashi Astrological Services',
        url: baseUrl,
        telephone: '+91 9831049814',
      },
    }),
  },
  panchang: {
    title: "Today's Daily Vedic Panchang & Shubh Choghadiya Muhurat | 12Rashi",
    description:
      'Accurate daily Panchang with Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, Yamaganda, and auspicious Choghadiya Muhurat timings for your city.',
    keywords:
      'daily panchang, aaj ka panchang, choghadiya muhurat, rahu kaal timings, hindu calendar, shubh muhurat, tithi nakshatra, 12rashi',
    ogType: 'website',
    schemaType: 'WebApplication',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: "12Rashi Daily Vedic Panchang & Choghadiya Engine",
      url: `${baseUrl}/?tab=panchang`,
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'All',
      description:
        'Calculates real-time Vedic planetary positions, Rahu Kaal windows, Abhijit Muhurat, and Day/Night Choghadiya.',
    }),
  },
  kundli: {
    title: 'Free Janam Kundli & Birth Chart Calculator with Dasha Analysis | 12Rashi',
    description:
      'Generate your precise Vedic Janam Kundli online with Lagna chart, Navamsha D9, planetary positions, Vimshottari Mahadasha, and remedial stones.',
    keywords:
      'free janam kundli, birth chart online, kundli generator, lagna chart, navamsha d9, vimshottari mahadasha, horoscope calculator, 12rashi',
    ogType: 'website',
    schemaType: 'SoftwareApplication',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: '12Rashi Vedic Kundli & Birth Chart Calculator',
      url: `${baseUrl}/?tab=kundli`,
      applicationCategory: 'AstrologyApplication',
      operatingSystem: 'Web, Android, iOS',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
      },
      description:
        'Vedic astrology birth chart calculation engine providing Lagna, Moon sign, Nakshatra, and Vimshottari Dasha analysis.',
    }),
  },
  'ai-insights': {
    title: 'Rashi AI – 24/7 Intelligent Vedic Astrology Assistant | 12Rashi',
    description:
      'Ask personal astrological questions to Rashi AI powered by ancient Parashari and Jaimini Jyotish principles for instant, personalized cosmic guidance.',
    keywords:
      'ai astrologer, rashi ai, vedic astrology bot, instant horoscope prediction, astrology query, ask astrologer online, 12rashi',
    ogType: 'website',
    schemaType: 'SoftwareApplication',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Rashi AI Vedic Astrologer Assistant',
      url: `${baseUrl}/?tab=ai-insights`,
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'All',
      description:
        'Interactive 24/7 AI-powered Vedic astrology assistant synthesizing planetary transits and classical texts.',
    }),
  },
  horoscope: {
    title: "Today's Daily Horoscope Predictions for All 12 Rashis | 12Rashi",
    description:
      "Read today's Vedic horoscope forecast for Aries to Pisces. In-depth career, love, health guidance, lucky numbers, colors, and planetary transit impacts.",
    keywords:
      'daily horoscope, aaj ka rashifal, 12 rashis, mesh vrishabh mithun kark simha, zodiac sign predictions, daily astro forecast, 12rashi',
    ogType: 'article',
    schemaType: 'Article',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: "Today's Vedic Planetary Horoscope for 12 Rashis",
      url: `${baseUrl}/?tab=horoscope`,
      description:
        'Daily astrological forecasts and transit insights across Love, Career, Wealth, and Health for all 12 zodiac signs.',
      publisher: {
        '@type': 'Organization',
        name: '12Rashi',
        url: baseUrl,
      },
    }),
  },
  milan: {
    title: '36 Guna Kundli Milan – Free Vedic Matchmaking & Compatibility | 12Rashi',
    description:
      'Check marriage compatibility with authentic 36-Guna Ashtakoota Kundli Milan. Detailed scoring for Nadi, Bhakoot, Gana, Maitri, and Manglik Dosha.',
    keywords:
      '36 guna milan, kundli milan for marriage, matchmaking online, ashtakoota compatibility, nadi dosha, bhakoot, horoscope matching, 12rashi',
    ogType: 'website',
    schemaType: 'WebApplication',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: '12Rashi 36 Guna Ashtakoota Matchmaking Engine',
      url: `${baseUrl}/?tab=milan`,
      applicationCategory: 'MatchmakingApplication',
      description:
        'Vedic Ashtakoota 36-point marital compatibility calculation for bride and groom horoscopes.',
    }),
  },
  store: {
    title: 'Vedic Remedies – Sacred Mantras, 108 Jaap Mala, Vrat & Karma Sadhana | 12Rashi',
    description:
      'Explore classical non-physical Vedic remedies: authentic Sanskrit mantras, interactive 108 digital jaap mala, planetary fasting (vrat), daan and dosha shanti protocols.',
    keywords:
      'vedic remedies, mantra jaap, mahamrityunjaya, gayatri mantra, 108 mala counter, planetary fasting, daan seva, dosha remedies, 12rashi',
    ogType: 'website',
    schemaType: 'WebPage',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: '12Rashi Sacred Vedic Remedies & Mantra Sadhana',
      url: `${baseUrl}/?tab=store`,
      description:
        'Authentic non-physical Vedic spiritual remedies including sacred mantras, digital 108 jaap mala counter, planetary fasting rules, and daan seva recommendations.',
      telephone: '+91 9831049814',
    }),
  },
  'live-puja': {
    title: 'Live Temple Darshan & E-Pooja Booking | Kashi, Ujjain, Ayodhya | 12Rashi',
    description:
      'Watch live daily temple darshan from Kashi Vishwanath, Mahakaleshwar Ujjain, Ayodhya Hanumangarhi, and Haridwar. Book live puja sankalpas and monthly UPI subscriptions.',
    keywords:
      'live puja booking, temple darshan live, kashi vishwanath live aarti, mahakaleshwar bhasma aarti, ayodhya hanumangarhi live, live pooja subscription, 12rashi',
    ogType: 'website',
    schemaType: 'WebPage',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: '12Rashi Live Temple Darshan & E-Pooja Booking Portal',
      url: `${baseUrl}/?tab=live-puja`,
      description: 'Live streaming feeds and e-pooja bookings from verified sacred shrines across India.',
      telephone: '+91 9831049814',
    }),
  },
  reports: {
    title: '50+ Page Brihat Janam Kundli Lifetime PDF Dossier | 12Rashi',
    description:
      'Download comprehensive 50+ page Parashari Janam Kundli PDF dossier with 120-year Vimshottari Mahadasha timeline, career & wealth roadmap, and dosha remedies.',
    keywords:
      'brihat janam kundli pdf, 50 page kundli report, download kundli pdf, vimshottari dasha report, career astrology report, 12rashi reports',
    ogType: 'website',
    schemaType: 'WebPage',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: '12Rashi Comprehensive Kundli PDF Dossier & Lifetime Prediction Reports',
      url: `${baseUrl}/?tab=reports`,
      description: 'Comprehensive 50+ page Parashari Vedic Janam Kundli report download center.',
      telephone: '+91 9831049814',
    }),
  },
  archive: {
    title: 'My Astrological Transcripts, Voice Notes & Receipts | 12Rashi',
    description:
      'Access your past consultation audio recordings, astrologer prescription notes, prescribed remedies, and GST billing receipts anytime on 12Rashi.',
    keywords:
      'astrology receipts, consultation archive, prescription notes, remedy transcripts, 12rashi user portal',
    ogType: 'website',
    schemaType: 'WebPage',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: '12Rashi Consultation Archive & Receipts Portal',
      url: `${baseUrl}/?tab=archive`,
      description: 'Encrypted storage for past astrological consultation transcripts and GST receipts.',
    }),
  },
  prashna: {
    title: 'Unknown Birth Time Prashna Kundli (Horary Astrology) | 12Rashi',
    description:
      'No birth certificate or hospital birth time? Cast instant KP Prashna Kundli using sacred seed ephemeris (1-249) for binary answers, event timing & remedies.',
    keywords:
      'prashna kundli, horary astrology, unknown birth time astrology, kp prashna 249, instant astrology answers, 12rashi prashna',
    ogType: 'website',
    schemaType: 'WebApplication',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: '12Rashi KP Prashna Kundli (Horary) Engine',
      url: `${baseUrl}/?tab=prashna`,
      applicationCategory: 'AstrologyApplication',
      operatingSystem: 'All',
      description: 'Vedic Horary Prashna Kundli calculator for seekers without accurate birth time.',
    }),
  },
  'gift-cards': {
    title: 'Shubh Shagun Astrology Gift Cards & WhatsApp Vouchers | 12Rashi',
    description:
      'Gift auspicious astrology consultation vouchers (₹101, ₹251, ₹501, ₹1100, ₹2100) to family and friends for Birthdays, Weddings, Diwali & Career milestones.',
    keywords:
      'astrology gift cards, shubh shagun vouchers, gift kundli consultation, wedding shagun gift, birthday blessings, 12rashi gifts',
    ogType: 'website',
    schemaType: 'WebPage',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: '12Rashi Shubh Shagun Astrology Gift Cards',
      url: `${baseUrl}/?tab=gift-cards`,
      description: 'Auspicious digital astrology gift vouchers redeemable for live consultations and kundli dossiers.',
    }),
  },
  'async-qa': {
    title: 'Ask a Question – Astrologer Voice Note & Written Reply (₹99) | 12Rashi',
    description:
      'Submit your private question to verified Acharyas and receive personalized Vedic recorded voice note and written prescription under 12 hours.',
    keywords:
      'ask astrologer voice note, async astrology questions, voice note consultation, personalized horoscope answer, 12rashi ask',
    ogType: 'website',
    schemaType: 'Service',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: '12Rashi Asynchronous Astrologer Voice Note & Written Q&A',
      url: `${baseUrl}/?tab=async-qa`,
      offers: {
        '@type': 'Offer',
        price: '99',
        priceCurrency: 'INR',
      },
    }),
  },
  'daily-audio': {
    title: 'Daily Audio Rashi Fal & Morning Shubh Muhurat Push | 12Rashi',
    description:
      'Listen to your daily 2-minute morning audio astrological forecast for all 12 Rashis with Choghadiya and Rahu Kaal alerts.',
    keywords:
      'daily audio rashifal, morning audio horoscope, rashi fal podcast, muhurat push notification, 12rashi audio',
    ogType: 'website',
    schemaType: 'MediaObject',
    getSchema: (baseUrl) => ({
      '@context': 'https://schema.org',
      '@type': 'MediaObject',
      name: '12Rashi Daily Morning Audio Rashi Fal Broadcast',
      url: `${baseUrl}/?tab=daily-audio`,
    }),
  },
};

/**
 * Generates dynamic SEO config for a specific astrologer
 */
export function getAstrologerSeoConfig(astro: Astrologer, baseUrl: string) {
  const topSpecialties = astro.specialties.slice(0, 3).join(', ');
  const reviewCountStr = (astro.reviewsCount / 1000).toFixed(1);
  const title = `${astro.name} (${astro.experienceYears} Yrs Exp) – Verified Astrologer | 12Rashi`;
  const description = `Consult ${astro.name}, expert in ${topSpecialties}. Rated ${astro.rating}★ with ${reviewCountStr}k+ reviews. Available for live call & chat at ₹${astro.callRate}/min.`;
  const keywords = `${astro.name}, ${astro.specialties.join(', ')}, ${astro.languages.join(', ')}, Vedic Astrologer, Consult Astrologer Online, 12Rashi`;
  const canonicalUrl = `${baseUrl}/?tab=astrologers&astrologer=${astro.id}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: astro.name,
    jobTitle: 'Vedic Astrologer & Jyotish Master',
    image: astro.avatar,
    url: canonicalUrl,
    description: astro.about || `${astro.title} with ${astro.experienceYears} years of experience in ${topSpecialties}.`,
    knowsAbout: astro.specialties,
    knowsLanguage: astro.languages,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: astro.rating,
      reviewCount: astro.reviewsCount,
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      price: astro.callRate,
      priceCurrency: 'INR',
      availability: astro.status === 'online' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      description: `Live astrological consultation at ₹${astro.callRate}/min with per-second billing`,
    },
  };

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    ogType: 'profile',
    ogImage: astro.avatar,
    schema,
  };
}

interface DynamicMetaManagerProps {
  activeTab: string;
  selectedAstrologer: Astrologer | null;
  onClearSelectedAstrologer?: () => void;
}

export const DynamicMetaManager: React.FC<DynamicMetaManagerProps> = ({
  activeTab,
  selectedAstrologer,
}) => {
  const [showInspector, setShowInspector] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Determine current metadata
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://12rashi.com';
  
  let currentTitle = '12Rashi - Live Astrology, Kundli & Consultations';
  let currentDesc = "Comprehensive Vedic astrology platform featuring live consultations, Kundli analytics, daily horoscopes, AI predictions, and non-physical Vedic mantra remedies.";
  let currentKeywords = 'astrology, kundli, horoscope, vedic astrology, astrologer live, 12rashi';
  let currentCanonical = `${baseUrl}/?tab=${activeTab}`;
  let currentOgImage = `${baseUrl}/favicon.ico`;
  let currentOgType = 'website';
  let currentSchema: object = {};

  if (selectedAstrologer) {
    const astroSeo = getAstrologerSeoConfig(selectedAstrologer, baseUrl);
    currentTitle = astroSeo.title;
    currentDesc = astroSeo.description;
    currentKeywords = astroSeo.keywords;
    currentCanonical = astroSeo.canonicalUrl;
    currentOgImage = astroSeo.ogImage;
    currentOgType = astroSeo.ogType;
    currentSchema = astroSeo.schema;
  } else if (TAB_SEO_CONFIGS[activeTab]) {
    const tabConfig = TAB_SEO_CONFIGS[activeTab];
    currentTitle = tabConfig.title;
    currentDesc = tabConfig.description;
    currentKeywords = tabConfig.keywords;
    currentCanonical = `${baseUrl}/?tab=${activeTab}`;
    currentOgType = tabConfig.ogType;
    currentSchema = tabConfig.getSchema(baseUrl, '12Rashi');
  }

  // Update DOM Meta Tags dynamically on state change
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Update <title>
    document.title = currentTitle;

    // 2. Helper to set/create <meta> tags
    const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Helper to set/create <link rel="..."> tags
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Standard SEO Tags
    setMetaTag('meta[name="description"]', 'name', 'description', currentDesc);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', currentKeywords);

    // OpenGraph Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', currentTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', currentDesc);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentCanonical);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', currentOgType);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', '12Rashi');
    if (currentOgImage) {
      setMetaTag('meta[property="og:image"]', 'property', 'og:image', currentOgImage);
    }

    // Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', currentTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', currentDesc);
    if (currentOgImage) {
      setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', currentOgImage);
    }

    // Canonical Link
    setLinkTag('canonical', currentCanonical);

    // Schema.org JSON-LD structured data injection
    const scriptId = 'dynamic-seo-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(currentSchema, null, 2);

    // 4. Clean URL query synchronization for search engines & bookmarks
    try {
      const currentUrl = new URL(window.location.href);
      if (selectedAstrologer) {
        currentUrl.searchParams.set('tab', 'astrologers');
        currentUrl.searchParams.set('astrologer', selectedAstrologer.id);
      } else {
        currentUrl.searchParams.set('tab', activeTab);
        currentUrl.searchParams.delete('astrologer');
      }
      window.history.replaceState({}, '', currentUrl.toString());
    } catch {
      // non-critical error
    }
  }, [currentTitle, currentDesc, currentKeywords, currentCanonical, currentOgType, currentOgImage, currentSchema, activeTab, selectedAstrologer]);

  const copySchemaJson = () => {
    navigator.clipboard?.writeText(JSON.stringify(currentSchema, null, 2));
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  // DynamicMetaManager works strictly in document.head in the background
  return null;
};
