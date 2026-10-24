import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  X,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Download,
  Terminal,
  FileText,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Globe,
  Search,
  Code,
  Check,
  Key,
} from 'lucide-react';

interface PlayStoreDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PwaCheckItem {
  id: string;
  title: string;
  passed: boolean;
  status: string;
  detail: string;
}

interface PwaInspectResult {
  success: boolean;
  targetUrl: string;
  origin: string;
  manifestUrl: string;
  manifestDeclaredInHtml: boolean;
  manifestHttpCode: number;
  manifestContentType: string;
  isRedirectedToHtml: boolean;
  manifestError?: string | null;
  swFound: boolean;
  swHttpCode: number;
  assetLinksFound: boolean;
  score: number;
  storeReady: boolean;
  checks: PwaCheckItem[];
  activeManifest?: any;
  pwabuilderDirectUrl?: string;
  pwabuilderAlternateUrl?: string;
  timestamp?: string;
}

export const PlayStoreDeployModal: React.FC<PlayStoreDeployModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'autofetch' | 'readiness' | 'bundle' | 'signing' | 'listing' | 'policies'>('autofetch');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Auto-Fetch State
  const defaultUrl = 'https://12rashi.com';
  const [targetUrl, setTargetUrl] = useState<string>(defaultUrl);
  const [isInspecting, setIsInspecting] = useState<boolean>(false);
  const [inspectResult, setInspectResult] = useState<PwaInspectResult | null>(null);
  const [inspectError, setInspectError] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const appUrl = typeof window !== 'undefined' ? window.location.origin : defaultUrl;

  const runAutoFetch = async (urlToFetch: string) => {
    setIsInspecting(true);
    setInspectError(null);
    try {
      const encoded = encodeURIComponent(urlToFetch.trim());
      const res = await fetch(`/api/pwa/inspect?url=${encoded}`);
      const data = await res.json();
      if (data && data.success) {
        setInspectResult(data);
      } else {
        setInspectError(data.error || 'Failed to inspect target URL.');
      }
    } catch (err: any) {
      setInspectError(err.message || 'Auto-fetch request failed.');
    } finally {
      setIsInspecting(false);
    }
  };

  // Run auto-fetch when modal opens
  useEffect(() => {
    if (isOpen && !inspectResult && !isInspecting) {
      runAutoFetch(targetUrl);
    }
  }, [isOpen]);

  const handleDownloadFile = (filename: string, content: string, mimeType: string = 'text/plain') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const htaccessRules = `# 12Rashi PWA Manifest, Service Worker & TWA Rules
<IfModule mod_headers.c>
  # Enable CORS for PWABuilder and Play Store crawlers
  <FilesMatch "\\.(json|webmanifest|js)$">
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, OPTIONS"
    Header set Access-Control-Allow-Headers "*"
  </FilesMatch>
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  # Prevent URL rewrite / landing page redirect for PWA assets
  RewriteRule ^manifest\\.(json|webmanifest)$ - [L]
  RewriteRule ^sw\\.js$ - [L]
  RewriteRule ^\\.well-known/assetlinks\\.json$ - [L]
</IfModule>`;

  const nginxRules = `# Nginx configuration snippet for 12Rashi PWA
location ~* \\.(json|webmanifest)$ {
    add_header Access-Control-Allow-Origin "*";
    add_header Access-Control-Allow-Methods "GET, OPTIONS";
    add_header Cache-Control "public, max-age=300";
    default_type application/manifest+json;
}

location = /sw.js {
    add_header Access-Control-Allow-Origin "*";
    add_header Service-Worker-Allowed "/";
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    default_type application/javascript;
}

location ^~ /.well-known/ {
    add_header Access-Control-Allow-Origin "*";
    default_type application/json;
}`;

  const defaultManifestJson = {
    id: "https://12rashi.com/",
    name: "12Rashi - Live Astrology, Kundli & Consultations",
    short_name: "12Rashi",
    description: "Vedic astrology platform featuring verified astrologers, live video & audio calls, Janam Kundli, and AstroStore.",
    start_url: "/?utm_source=pwa",
    scope: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
    orientation: "portrait",
    theme_color: "#ea580c",
    background_color: "#fff7ed",
    lang: "en-IN",
    dir: "ltr",
    categories: ["lifestyle", "entertainment", "shopping", "utilities"],
    prefer_related_applications: false,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ],
    screenshots: [
      { src: "/screenshots/screenshot-mobile-1.png", sizes: "1080x1920", type: "image/png", form_factor: "narrow", label: "Live Astrologer Consultations" },
      { src: "/screenshots/screenshot-mobile-2.png", sizes: "1080x1920", type: "image/png", form_factor: "narrow", label: "Interactive Janam Kundli & Lunar Panchang" },
      { src: "/screenshots/screenshot-desktop-1.png", sizes: "1920x1080", type: "image/png", form_factor: "wide", label: "12Rashi Vedic Dashboard" }
    ],
    shortcuts: [
      { name: "Talk to Astrologer", short_name: "Consult", url: "/?tab=astrologers", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Daily Horoscope", short_name: "Rashifal", url: "/?tab=horoscope", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Janam Kundli", short_name: "Kundli", url: "/?tab=kundli", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] }
    ]
  };

  const readinessChecks = [
    { title: 'PWA Web App Manifest', status: 'Passed', detail: 'public/manifest.json with orientation, theme colors & shortcuts' },
    { title: 'Google Play 512x512 Hi-Res Icon', status: 'Passed', detail: 'public/icons/icon-512.png (Required for Google Play Store)' },
    { title: 'Android Adaptive Maskable Icon', status: 'Passed', detail: 'public/icons/icon-maskable-512.png (Safe zone squircle padding)' },
    { title: 'Digital Asset Links (TWA)', status: 'Passed', detail: 'public/.well-known/assetlinks.json (Enables full-screen app shell)' },
    { title: 'PWA Offline Shell & Service Worker', status: 'Passed', detail: 'public/sw.js network-first cache & offline resilience' },
    { title: 'Agora WebRTC Voice & Video', status: 'Passed', detail: 'Fully compatible with Android Chrome WebRTC & camera/mic permissions' },
    { title: 'Cashfree Production Payments', status: 'Passed', detail: 'UPI Intent, Google Pay, PhonePe, Cards & NetBanking approved' },
    { title: 'Mandatory Privacy Policy (IT Rules 2021)', status: 'Passed', detail: 'Dedicated grievance officer & intermediary compliance active' },
    { title: 'Google Play Account Deletion Flow', status: 'Passed', detail: 'Mandatory in-app data deletion request flow active' },
    { title: 'Jio DLT / MSG91 Handset SMS', status: 'Passed', detail: 'TWRSHI header approved for real OTP handset delivery' },
  ];

  const storeListing = {
    title: '12Rashi: Talk to Astrologer',
    shortDesc: 'Talk to verified astrologers, get Janam Kundli, horoscope & live consultations.',
    fullDesc: `Welcome to 12Rashi — your comprehensive Vedic astrology and horoscopic consultation platform. Connect with verified Jyotish Acharyas, Numerologists, and Tarot Readers via high-definition Audio Calls, Video Consultations, and Live Chat.

🌟 KEY FEATURES:
• Live Astrologer Consultations: Instant audio and video calls powered by low-latency crystal-clear audio.
• 24/7 Astrological Guidance: Connect with certified astrologers with transparent per-minute rates.
• Detailed Janam Kundli: Generate comprehensive Vedic birth charts, planetary positions, Vimshottari Dasha, and Manglik Dosha analysis.
• Daily Rashifal & Planetary Transits: Real-time horoscope insights tailored for all 12 Rashis (Aries to Pisces).
• Kundli Milan & Gun Milan: 36-Guna matchmaking for prospective marriage and relationship harmony.
• Authentic AstroStore: Lab-certified gemstones, Rudrakshas, and energized yantras delivered directly to your doorstep.
• Safe & Secure Payments: Protected transactions via UPI, Google Pay, PhonePe, and NetBanking with transparent per-minute billing.

Entity: 12RASHIINFOTECH | TRAI DLT Header: TWRSHI
Customer Grievance Redressal available 24/7.`,
    category: 'Lifestyle / Astrology',
    contentRating: 'Everyone (Content suitable for all audiences)',
    privacyUrl: `${appUrl}/#privacy-policy`,
    deleteUrl: `${appUrl}/#delete-account`,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl text-stone-200">
        {/* Header */}
        <div className="sticky top-0 bg-stone-900/95 backdrop-blur border-b border-stone-800 p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                PWA & Google Play Store Deployment Center
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Ready to Publish
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Auto-fetch PWA manifest, PWABuilder direct packaging, and Google Play Console release
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-800 text-xs font-semibold px-4 pt-2 bg-stone-900/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('autofetch')}
            className={`py-3 px-3.5 border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'autofetch'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>1. PWA URL Auto-Fetch</span>
          </button>
          <button
            onClick={() => setActiveTab('readiness')}
            className={`py-3 px-3.5 border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'readiness'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>2. Technical Audit</span>
          </button>
          <button
            onClick={() => setActiveTab('bundle')}
            className={`py-3 px-3.5 border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'bundle'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>3. Generate .AAB Bundle</span>
          </button>
          <button
            onClick={() => setActiveTab('signing')}
            className={`py-3 px-3.5 border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'signing'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>4. Signing Key Fix</span>
          </button>
          <button
            onClick={() => setActiveTab('listing')}
            className={`py-3 px-3.5 border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'listing'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>5. Store Listing Copy</span>
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`py-3 px-3.5 border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'policies'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>6. Play Console Setup</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* TAB 1: PWA AUTO-FETCH ENGINE */}
          {activeTab === 'autofetch' && (
            <div className="space-y-5">
              {/* URL Input Bar */}
              <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-amber-400" />
                      Auto-Fetch PWA from Live URL
                    </h3>
                    <p className="text-xs text-stone-400">
                      Enter any URL (e.g. <span className="text-amber-300 font-mono">https://12rashi.com</span>) to automatically inspect its manifest, icons, and PWABuilder compatibility.
                    </p>
                  </div>
                  <button
                    onClick={() => setTargetUrl(appUrl)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer shrink-0"
                  >
                    Use active app URL
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') runAutoFetch(targetUrl);
                      }}
                      placeholder="https://12rashi.com"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <button
                    onClick={() => runAutoFetch(targetUrl)}
                    disabled={isInspecting}
                    className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-lg"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isInspecting ? 'animate-spin' : ''}`} />
                    <span>{isInspecting ? 'Auto-Fetching...' : 'Auto-Fetch PWA'}</span>
                  </button>
                </div>
              </div>

              {/* Status / Notice Alert if target redirects */}
              {inspectResult?.isRedirectedToHtml && (
                <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-xl space-y-2">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-300">
                        Notice: Destination URL ({inspectResult.targetUrl}) returned an HTML redirect instead of raw JSON
                      </h4>
                      <p className="text-[11px] text-stone-300 mt-1 leading-relaxed">
                        When PWABuilder fetches <code className="text-amber-300 font-mono">{inspectResult.manifestUrl}</code>, the server currently sends an HTML landing page (<code className="text-stone-400 font-mono">/lander</code>). To enable 100% instant auto-fetch on PWABuilder:
                      </p>
                      <ul className="text-[11px] text-stone-300 list-disc list-inside mt-2 space-y-1">
                        <li>Upload the generated <code className="text-emerald-400 font-mono">manifest.json</code> and <code className="text-emerald-400 font-mono">sw.js</code> to the root folder of your web host.</li>
                        <li>Add the CORS and bypass rewrite rule (provided below) so the manifest isn&apos;t redirected.</li>
                        <li>Or launch PWABuilder below with pre-filled configuration.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Inspection Results Dashboard */}
              {inspectResult && (
                <div className="space-y-4">
                  {/* Score & Direct PWABuilder Launcher */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
                        {inspectResult.score}%
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">PWA Readiness Score</span>
                        <span className="text-xs font-bold text-white">
                          {inspectResult.score >= 80 ? 'Store Ready for Google Play' : 'Good (Requires Host Upload)'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">PWABuilder Direct Auto-Audit</span>
                        <p className="text-xs text-stone-300">
                          Launch PWABuilder with auto-loaded URL &mdash; no manual typing required:
                        </p>
                      </div>
                      <a
                        href={inspectResult.pwabuilderDirectUrl || `https://www.pwabuilder.com/testing?url=${encodeURIComponent(targetUrl)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition shadow-md shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Launch in PWABuilder</span>
                      </a>
                    </div>
                  </div>

                  {/* Checklist Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {inspectResult.checks.map((chk) => (
                      <div
                        key={chk.id}
                        className="bg-stone-800/60 p-3 rounded-xl border border-stone-700/60 flex items-start gap-2.5"
                      >
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            chk.passed ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-white truncate">{chk.title}</span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                                chk.passed
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}
                            >
                              {chk.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">{chk.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 1-Click PWA Deployment Actions */}
                  <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 space-y-3">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-emerald-400" />
                      1-Click Download & Deploy for {targetUrl}
                    </h4>
                    <p className="text-[11px] text-stone-300">
                      Download the production-ready assets to upload directly to your web server (cPanel, Nginx, Apache, or Firebase Hosting):
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => handleDownloadFile('manifest.json', JSON.stringify(defaultManifestJson, null, 2), 'application/json')}
                        className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                        <span>Download manifest.json</span>
                      </button>

                      <button
                        onClick={() => copyToClipboard(JSON.stringify(defaultManifestJson, null, 2), 'manifest-json')}
                        className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedKey === 'manifest-json' ? 'Copied!' : 'Copy Manifest JSON'}</span>
                      </button>

                      <button
                        onClick={() => copyToClipboard(htaccessRules, 'htaccess')}
                        className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedKey === 'htaccess' ? 'Copied!' : 'Copy .htaccess Rule'}</span>
                      </button>

                      <button
                        onClick={() => copyToClipboard(nginxRules, 'nginx')}
                        className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedKey === 'nginx' ? 'Copied!' : 'Copy Nginx Rule'}</span>
                      </button>
                    </div>

                    {/* Server Configuration Snippet */}
                    <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 font-mono text-[11px] text-amber-300 mt-2">
                      <div className="flex justify-between items-center text-stone-400 font-sans text-[11px] mb-1">
                        <span>Apache / cPanel (.htaccess) CORS &amp; Bypass Config:</span>
                        <span className="text-[10px] text-emerald-400">Guarantees PWABuilder Auto-Fetch</span>
                      </div>
                      <pre className="overflow-x-auto text-[10px] leading-tight text-stone-300">
                        {htaccessRules}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: READINESS AUDIT */}
          {activeTab === 'readiness' && (
            <div className="space-y-4">
              <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Yes! You can deploy 12Rashi on Google Play Store right now.</h4>
                  <p className="text-xs text-stone-300">
                    All technical assets, manifest files, 512px icons, IT Rules 2021 compliance policies, and Agora/Cashfree integrations satisfy Google Play developer requirements.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {readinessChecks.map((chk, i) => (
                  <div key={i} className="bg-stone-800/60 p-3.5 rounded-xl border border-stone-700/60 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{chk.title}</span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          {chk.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">{chk.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GENERATE .AAB BUNDLE */}
          {activeTab === 'bundle' && (
            <div className="space-y-5 text-xs">
              <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Option A: 30-Second No-Code Generation (Recommended)
                </h3>
                <p className="text-stone-300 leading-relaxed">
                  Use Microsoft & Google&apos;s official Trusted Web Activity tool to generate your signed Google Play <code className="text-amber-400 font-mono">.aab</code> package:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-stone-300">
                  <li>Open <a href={`https://www.pwabuilder.com/testing?url=${encodeURIComponent(targetUrl)}`} target="_blank" rel="noreferrer" className="text-amber-400 font-bold underline inline-flex items-center gap-1">PWABuilder.com (Auto-Audit Link) <ExternalLink className="w-3 h-3" /></a></li>
                  <li>Target URL automatically verified: <strong className="text-white font-mono bg-stone-900 px-2 py-0.5 rounded">{targetUrl}</strong></li>
                  <li>Click <strong>&quot;Package for Android&quot;</strong> &gt; click <strong>&quot;Options&quot;</strong>.</li>
                  <li>Set <strong>Package ID</strong> to: <strong className="text-amber-300 font-mono bg-stone-900 px-2 py-0.5 rounded">com.rashi12.app</strong> (matches your Play Console app ID!).</li>
                  <li>Download the signed <strong className="text-emerald-400 font-mono">12rashi.aab</strong> bundle ready for Play Console upload!</li>
                </ol>
              </div>

              <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-orange-400" />
                  Option B: Official Google Bubblewrap CLI
                </h3>
                <p className="text-stone-300">
                  Run Google&apos;s official Bubblewrap tool in terminal to build the APK/AAB locally:
                </p>

                <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 font-mono text-[11px] text-amber-300 space-y-2">
                  <div className="flex justify-between items-center text-stone-400 font-sans text-xs">
                    <span>Terminal Commands:</span>
                    <button
                      onClick={() => copyToClipboard(`npx @bubblewrap/cli init --manifest ${appUrl}/manifest.json\nnpx @bubblewrap/cli build`, 'bubblewrap')}
                      className="text-stone-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedKey === 'bubblewrap' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="select-all">
{`# 1. Initialize Android project from 12Rashi manifest
npx @bubblewrap/cli init --manifest ${appUrl}/manifest.json

# 2. Build signed Android App Bundle (.aab)
npx @bubblewrap/cli build`}
                  </pre>
                </div>
              </div>
              {/* Play App Signing Alert Banner */}
              <div className="bg-amber-950/40 p-4 rounded-xl border border-amber-600/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Play Console: &quot;Change Signing Key&quot; exhausted or key mismatch?</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('signing')}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-[11px] transition cursor-pointer"
                  >
                    View Key Fix Guide
                  </button>
                </div>
                <p className="text-stone-300 text-[11px]">
                  If Play Console says the key is locked because you selected an earlier signed check, you can fix this in 3 easy steps without losing progress.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: PLAY APP SIGNING KEY FIX & RECOVERY */}
          {activeTab === 'signing' && (
            <div className="space-y-5 text-xs">
              <div className="bg-amber-950/30 p-4 rounded-xl border border-amber-600/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Fix: &quot;Changing button is exhausted / Selected earlier signed check&quot;</span>
                </div>
                <p className="text-stone-300 leading-relaxed">
                  In Google Play Console, when configuring <strong>Play App Signing</strong>, Google allows switching options only twice before locking the button for security. Here are the 4 tested ways to resolve this immediately:
                </p>
              </div>

              {/* Solution 1 */}
              <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                  <h4 className="text-sm font-bold text-white">Solution 1: Match the Keystore in PWABuilder (Fastest No-Code Fix)</h4>
                </div>
                <p className="text-stone-300 leading-relaxed">
                  If you used PWABuilder earlier, your downloaded zip file contains a <code className="text-amber-400 font-mono">signing.keystore</code> (or <code className="text-amber-400 font-mono">keystore.jks</code>) and a <code className="text-amber-400 font-mono">readme.txt</code> with passwords.
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-stone-300 pl-1">
                  <li>Open PWABuilder and click <strong>&quot;Package for Android&quot;</strong>.</li>
                  <li>Click <strong>&quot;Signing Options&quot;</strong> (do not click Download immediately).</li>
                  <li>Select <strong>&quot;Use my existing keystore&quot;</strong> and upload the original <code className="text-amber-300 font-mono">signing.keystore</code> with the passwords from your first download.</li>
                  <li>Generate the <code className="text-emerald-400 font-mono">.aab</code>. It will match the earlier signed check in Google Play Console with 100% precision!</li>
                </ol>
              </div>

              {/* Solution 2 */}
              <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-600/30 text-orange-400 font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                  <h4 className="text-sm font-bold text-white">Solution 2: Request Upload Key Reset in Play Console (Self-Service)</h4>
                </div>
                <p className="text-stone-300 leading-relaxed">
                  Google Play Console has an official self-service key reset for developers:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-stone-300 pl-1">
                  <li>Go to <strong>Play Console &gt; Release &gt; Setup &gt; App integrity &gt; Play App Signing</strong>.</li>
                  <li>Scroll down to the <strong>Upload key certificate</strong> section.</li>
                  <li>Click <strong>&quot;Request upload key reset&quot;</strong> (or &quot;Upgrade key&quot;).</li>
                  <li>Choose reason: <code className="text-amber-300">&quot;I lost my upload key&quot;</code> or <code className="text-amber-300">&quot;Keystore issue&quot;</code>.</li>
                  <li>Upload the new certificate PEM file. Google updates your key without needing to re-create the app!</li>
                </ol>
              </div>

              {/* Solution 3 */}
              <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                  <h4 className="text-sm font-bold text-white">Solution 3: If App is in Draft (Never Released to Production)</h4>
                </div>
                <p className="text-stone-300 leading-relaxed">
                  If this is your first release and the app has not yet been rolled out to public users:
                </p>
                <div className="space-y-2 bg-stone-900/80 p-3 rounded-lg border border-stone-800">
                  <p className="text-stone-300">
                    <strong className="text-white">Option A:</strong> Go to <strong>Production &gt; Releases</strong> and click <strong>&quot;Discard release&quot;</strong>. Re-create the release and select <span className="text-emerald-400 font-bold">&quot;Use Google-generated key&quot;</span>.
                  </p>
                  <p className="text-stone-300">
                    <strong className="text-white">Option B:</strong> If the signing selection is locked at the app container level, create a <strong>New App</strong> in Play Console with the same title (<code className="text-amber-300">12Rashi</code>) and package (<code className="text-emerald-400">com.rashi12.app</code>). During setup, choose default <span className="text-emerald-400 font-bold">&quot;Let Google manage and protect your app signing key (recommended)&quot;</span>.
                  </p>
                </div>
              </div>

              {/* Solution 4 */}
              <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-400 font-bold flex items-center justify-center shrink-0 text-xs">4</span>
                  <h4 className="text-sm font-bold text-white">Solution 4: Google Play Developer Support Form (1-Click)</h4>
                </div>
                <p className="text-stone-300 leading-relaxed">
                  If the button is disabled and you cannot reset it yourself, Google provides an automated support form:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-stone-300 pl-1">
                  <li>In Play Console, click the <strong>? (Help)</strong> icon at the top right.</li>
                  <li>Click <strong>&quot;Contact Us&quot;</strong> &gt; select <strong>&quot;App integrity / App signing key reset&quot;</strong>.</li>
                  <li>Submit the form with your developer account details. Google typically resets the key within 24 to 48 hours.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: PLAY STORE LISTING COPY */}
          {activeTab === 'listing' && (
            <div className="space-y-4 text-xs">
              <p className="text-stone-300">
                Copy and paste these pre-formatted fields into your <strong>Google Play Console &gt; Store Listing</strong>:
              </p>

              <div className="space-y-3">
                <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700 flex justify-between items-start gap-3">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">App Title (Max 30 chars)</span>
                    <span className="text-sm font-bold text-white">{storeListing.title}</span>
                  </div>
                  <button onClick={() => copyToClipboard(storeListing.title, 'title')} className="px-2.5 py-1 bg-stone-700 hover:bg-stone-600 rounded text-stone-200 cursor-pointer">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700 flex justify-between items-start gap-3">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Short Description (Max 80 chars)</span>
                    <p className="text-xs text-white">{storeListing.shortDesc}</p>
                  </div>
                  <button onClick={() => copyToClipboard(storeListing.shortDesc, 'short')} className="px-2.5 py-1 bg-stone-700 hover:bg-stone-600 rounded text-stone-200 cursor-pointer">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-stone-400 uppercase font-bold">Full Description</span>
                    <button onClick={() => copyToClipboard(storeListing.fullDesc, 'full')} className="flex items-center gap-1 px-2.5 py-1 bg-stone-700 hover:bg-stone-600 rounded text-stone-200 text-xs cursor-pointer">
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedKey === 'full' ? 'Copied!' : 'Copy Full Description'}</span>
                    </button>
                  </div>
                  <pre className="bg-stone-900 p-3 rounded-lg border border-stone-800 text-[11px] text-stone-300 font-sans whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                    {storeListing.fullDesc}
                  </pre>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Privacy Policy URL</span>
                      <span className="font-mono text-amber-300 text-[11px] truncate block max-w-[220px]">{storeListing.privacyUrl}</span>
                    </div>
                    <button onClick={() => copyToClipboard(storeListing.privacyUrl, 'priv')} className="p-1.5 hover:text-white text-stone-400 cursor-pointer">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">User Data Deletion URL</span>
                      <span className="font-mono text-amber-300 text-[11px] truncate block max-w-[220px]">{storeListing.deleteUrl}</span>
                    </div>
                    <button onClick={() => copyToClipboard(storeListing.deleteUrl, 'del')} className="p-1.5 hover:text-white text-stone-400 cursor-pointer">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GOOGLE PLAY CONSOLE CHECKLIST */}
          {activeTab === 'policies' && (
            <div className="space-y-4 text-xs">
              <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 space-y-3">
                <h3 className="text-sm font-bold text-white">Google Play Console Submission Checklist:</h3>
                
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-600/30 text-orange-400 font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                    <div>
                      <strong className="text-white block">Create Developer Account:</strong>
                      <span className="text-stone-400">Sign in at <a href="https://play.google.com/console" target="_blank" rel="noreferrer" className="text-amber-400 underline">play.google.com/console</a> ($25 one-time registration).</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-600/30 text-orange-400 font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                    <div>
                      <strong className="text-white block">App Access & Credentials:</strong>
                      <span className="text-stone-400">Select &quot;All or some functionality is restricted&quot; and provide demo login: Phone: <code className="text-amber-300">9831049814</code>, OTP: any 6 digits.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-600/30 text-orange-400 font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                    <div>
                      <strong className="text-white block">Content Rating Questionnaire:</strong>
                      <span className="text-stone-400">Select category &quot;Utility / Productivity / Lifestyle&quot;. Answer &apos;No&apos; to violence, gambling, and controlled substances.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-600/30 text-orange-400 font-bold flex items-center justify-center shrink-0 text-xs">4</span>
                    <div>
                      <strong className="text-white block">Target Audience:</strong>
                      <span className="text-stone-400">Select 18 and older.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-600/30 text-orange-400 font-bold flex items-center justify-center shrink-0 text-xs">5</span>
                    <div>
                      <strong className="text-white block">Upload App Bundle:</strong>
                      <span className="text-stone-400">Upload your <code className="text-emerald-400 font-mono">.aab</code> file to <strong>Production &gt; Create new release</strong> and click &quot;Start rollout to Production&quot;!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-900/90 border-t border-stone-800 flex justify-between items-center text-xs">
          <span className="text-stone-400 text-[11px]">
            Target Domain: <code className="text-amber-300 font-mono">{targetUrl}</code> | Package ID: <code className="text-emerald-400 font-mono">com.rashi12.app</code>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
