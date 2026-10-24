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

  return (
    <>
      {/* Floating SEO Manager Inspector Trigger (Fixed bottom right above nav) */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 z-40">
        <button
          onClick={() => setShowInspector(!showInspector)}
          className="group px-3 py-2 rounded-full bg-stone-900/90 hover:bg-stone-950 text-white border border-amber-500/40 shadow-xl backdrop-blur-md text-xs font-semibold flex items-center gap-2 cursor-pointer transition transform hover:scale-105"
          title="Inspect Live Dynamic SEO Meta Tags & Schema.org JSON-LD"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Search className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline font-mono text-[11px] text-amber-200">
            SEO Meta: {selectedAstrologer ? selectedAstrologer.name : activeTab}
          </span>
          <span className="md:hidden text-[10px]">SEO</span>
        </button>
      </div>

      {/* SEO Inspector Modal */}
      {showInspector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl border border-amber-400 dark:border-stone-700 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white flex items-center justify-between shrink-0 border-b border-amber-500/30">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Search className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm leading-tight flex items-center gap-2">
                    <span>Dynamic SEO & Meta Tag Manager</span>
                    <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                      SYNCED
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Live Document Metadata, OpenGraph & Schema.org JSON-LD
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowInspector(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Google Search Engine Result Snippet Preview */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-stone-500 text-[10px] font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-500" />
                    <span>Google Search Result Snippet Preview</span>
                  </span>
                  <span className="text-emerald-600 font-mono">Mobile & Desktop</span>
                </div>

                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono truncate">
                    <span className="w-3.5 h-3.5 rounded-full bg-orange-600 text-white text-[8px] flex items-center justify-center font-bold">12R</span>
                    <span>12rashi.com › {selectedAstrologer ? `astrologers › ${selectedAstrologer.id}` : activeTab}</span>
                  </div>
                  <h4 className="text-blue-700 dark:text-blue-400 font-medium text-sm sm:text-base hover:underline cursor-pointer leading-snug">
                    {currentTitle}
                  </h4>
                  <p className="text-stone-600 dark:text-stone-300 text-xs leading-relaxed line-clamp-2">
                    {currentDesc}
                  </p>
                </div>
              </div>

              {/* Live Meta Tag Attributes Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide text-xs flex items-center justify-between">
                  <span>Active Head Meta Tags</span>
                  <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400">
                    Target: {selectedAstrologer ? `Astrologer [${selectedAstrologer.name}]` : `Tab [${activeTab}]`}
                  </span>
                </h4>

                <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2 font-mono text-[11px]">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-sans">document.title ({currentTitle.length} chars):</span>
                    <span className="text-stone-800 dark:text-stone-200 font-semibold">{currentTitle}</span>
                  </div>

                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
                    <span className="text-stone-400 block text-[10px] uppercase font-sans">meta[name="description"] ({currentDesc.length} chars):</span>
                    <span className="text-stone-700 dark:text-stone-300">{currentDesc}</span>
                  </div>

                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
                    <span className="text-stone-400 block text-[10px] uppercase font-sans">Canonical URL & og:url:</span>
                    <span className="text-amber-600 dark:text-amber-400 break-all">{currentCanonical}</span>
                  </div>

                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
                    <span className="text-stone-400 block text-[10px] uppercase font-sans">meta[name="keywords"]:</span>
                    <span className="text-stone-600 dark:text-stone-400 text-[10px]">{currentKeywords}</span>
                  </div>
                </div>
              </div>

              {/* Schema.org JSON-LD Structured Data */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide text-xs flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>Schema.org JSON-LD Structured Data</span>
                  </h4>

                  <button
                    onClick={copySchemaJson}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-mono text-[10px] flex items-center gap-1 cursor-pointer transition"
                  >
                    {copiedSchema ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSchema ? 'Copied' : 'Copy JSON-LD'}</span>
                  </button>
                </div>

                <pre className="p-3 bg-stone-900 text-amber-300 rounded-2xl overflow-x-auto text-[10px] font-mono leading-relaxed border border-stone-800 max-h-48">
                  {JSON.stringify(currentSchema, null, 2)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 px-5 shrink-0">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Google Search Console & OpenGraph Compliant</span>
              </span>
              <button
                onClick={() => setShowInspector(false)}
                className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold cursor-pointer transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
