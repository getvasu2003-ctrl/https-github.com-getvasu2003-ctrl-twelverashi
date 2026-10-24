import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  MessageSquare,
  Phone,
  Video,
  Star,
  ShieldCheck,
  Search,
  Filter,
  Flame,
  Clock,
  Sparkles,
  Award,
  Crown,
  Play,
  Calendar,
  HelpCircle,
  Users,
  CheckCircle2,
  XCircle,
  Mic,
  Headphones,
  Zap,
  Compass,
  Gift,
  Globe,
  X,
} from 'lucide-react';
import { Astrologer, ConsultationType } from '../../types/astrology.ts';
import { FreeTrialBanner } from '../growth/FreeTrialBanner.tsx';
import { useTranslation } from '../../i18n/useTranslation.ts';

interface AstrologerDirectoryProps {
  onOpenPrashna?: () => void;
  onOpenGiftCards?: () => void;
  onNavigate?: (tab: string) => void;
}

export const AstrologerDirectory: React.FC<AstrologerDirectoryProps> = ({
  onOpenPrashna,
  onOpenGiftCards,
  onNavigate,
}) => {
  const { t } = useTranslation();
  const {
    astrologers,
    startConsultation,
    setOpenPaymentModal,
    setOpenSlotBookingModal,
    setSelectedBookingAstrologer,
    setOpenAsyncQuestionModal,
    setOpenVideoIntroModal,
    setSelectedVideoAstro,
    setOpenFairBillingModal,
    setOpenTatkalModal,
    setOpenOnboardingModal,
    queueStatus,
    joinQueue,
    leaveQueue,
    addNotification,
    transitNudges,
    activeFamilyProfile,
    setOpenFamilyModal,
    setSelectedProfileAstrologer,
  } = useApp();

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'online'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'price_low' | 'orders'>('rating');
  const [showTransitNudges, setShowTransitNudges] = useState(true);

  // Extract all unique languages spoken by astrologers in directory
  const availableLanguages = useMemo(() => {
    const langSet = new Set<string>();
    astrologers.forEach((a) => {
      a.languages.forEach((l) => langSet.add(l));
    });
    return Array.from(langSet).sort();
  }, [astrologers]);

  const specialties = [
    'All',
    'AI Astrologers (24/7)',
    'Vedic Astrology',
    'Love & Relationship',
    'Marriage & Manglik Dosha',
    'Career & Wealth',
    'Govt Job & Civil Services',
    'Business & Startups',
    'Financial & Stock Market',
    'Crypto & Day Trading',
    'Health & Medical Astrology',
    'Child & Higher Education',
    'Fertility & Childbirth',
    'Foreign Travel & PR',
    'Shani & Sade Sati',
    'Spiritual & Protection',
    'Gemology & Lal Kitab',
    'Rudraksha & Sacred Beads',
    'Kundli & Horoscope',
    'Tarot Reading',
    'Angel & Akashic Divination',
    'Numerology',
    'Vastu Shastra',
    'KP Astrology',
    'Palmistry',
    'Nadi Jyotish',
    'Jaimini & Chara Dasha',
    'Ashtakavarga Precision',
    'Western & Psychological',
    'Prashna Kundli',
  ];

  // Filtering & Sorting
  const filteredAstrologers = astrologers
    .filter((a) => {
      if (selectedSpecialty === 'AI Astrologers (24/7)') {
        if (!a.isAi) return false;
      } else if (selectedSpecialty !== 'All') {
        const matchesSpecialty = a.specialties.includes(selectedSpecialty as any);
        const matchesBadge = a.categoryBadge && a.categoryBadge.toLowerCase().includes(selectedSpecialty.toLowerCase());
        const matchesRemedyCategory = a.remedySpecialties?.some(
          (r) => r.category.toLowerCase().includes(selectedSpecialty.toLowerCase())
        );
        if (!matchesSpecialty && !matchesBadge && !matchesRemedyCategory) {
          return false;
        }
      }
      if (selectedLanguage !== 'All' && !a.languages.includes(selectedLanguage)) {
        return false;
      }
      if (availabilityFilter === 'online' && a.status !== 'online') {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = a.name.toLowerCase().includes(query);
        const matchesSpecialty = a.specialties.some((s) => s.toLowerCase().includes(query));
        const matchesLang = a.languages.some((l) => l.toLowerCase().includes(query));
        return matchesName || matchesSpecialty || matchesLang;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      if (sortBy === 'price_low') return a.chatRate - b.chatRate;
      if (sortBy === 'orders') return b.ordersCount - a.ordersCount;
      return 0;
    });

  const handleStartConsult = (astro: Astrologer, type: ConsultationType) => {
    if (astro.status === 'busy') {
      joinQueue(astro.id);
      addNotification(
        'Joined Waitlist Queue',
        `You have secured waitlist ticket #${queueStatus ? queueStatus.position + 1 : 1} for ${astro.name}. Estimated wait ~${astro.waitTimeMins} mins. We will alert you immediately when free.`,
        'muhurat'
      );
      return;
    }
    if (astro.status === 'offline') {
      setSelectedBookingAstrologer(astro);
      setOpenSlotBookingModal(true);
      addNotification(
        'Astrologer Offline - Booking Slot',
        `${astro.name} is currently offline. You can reserve an upcoming guaranteed appointment slot.`,
        'muhurat'
      );
      return;
    }
    startConsultation(astro, type);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner for Astrologer Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-amber-100 text-xs font-bold mb-3 border border-amber-200/30">
            <Flame className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
            <span>Over 1,500+ Verified Certified Acharyas Online</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
            Consult India’s Top Astrologers Live
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-amber-50/90 leading-relaxed">
            Instant guidance for Career, Love, Marriage, Health, and Business Kundli matching.
            First consultation protected with 100% Satisfaction Guarantee.
          </p>
        </div>

        {/* Decorative Sun / Chakra background graphics */}
        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none w-64 h-64">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="45" />
          </svg>
        </div>
      </div>

      {/* Lentlo Live Queue Alert Banner if User is waiting */}
      {queueStatus && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">You are #{queueStatus.position} in Line</span>
                <span className="px-2 py-0.2 rounded-md bg-white/30 text-[10px] font-mono font-bold uppercase">
                  ACTIVE WAITLIST TICKET
                </span>
              </div>
              <p className="text-xs text-amber-100">
                Next free in ~{queueStatus.estimatedWaitMins} minutes. Keep app open or we'll ring you via push alert.
              </p>
            </div>
          </div>

          <button
            onClick={leaveQueue}
            className="px-3.5 py-1.5 rounded-xl bg-black/30 hover:bg-black/50 text-white text-xs font-bold border border-white/20 cursor-pointer transition flex items-center gap-1"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Leave Queue</span>
          </button>
        </div>
      )}

      {/* AstroTalk Style New User Welcome Free Trial Banner */}
      <FreeTrialBanner />

      {/* Quick Human-Centric Services Grid */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-stone-700 dark:text-stone-300">
              Vedic Services & Sacred Engines
            </h2>
          </div>
          <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400">
            Instant microsecond calculations
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
          {[
            {
              id: 'kundli',
              title: 'Janam Kundli',
              subtitle: 'Free Chart',
              icon: '📜',
              badge: 'Free',
              onClick: () => onNavigate ? onNavigate('kundli') : undefined,
            },
            {
              id: 'prashna',
              title: 'Prashna Kundli',
              subtitle: 'No Birth Time',
              icon: '🧭',
              badge: 'Instant',
              onClick: () => onNavigate ? onNavigate('prashna') : onOpenPrashna?.(),
            },
            {
              id: 'reports',
              title: '50+ Pg PDF',
              subtitle: 'Brihat Dossier',
              icon: '📑',
              badge: '₹499',
              onClick: () => onNavigate ? onNavigate('reports') : undefined,
            },
            {
              id: 'panchang',
              title: 'Panchang',
              subtitle: 'Daily Muhurat',
              icon: '🧭',
              badge: 'Daily',
              onClick: () => onNavigate ? onNavigate('panchang') : undefined,
            },
            {
              id: 'daily-audio',
              title: 'Audio Fal',
              subtitle: '2-Min Rashi',
              icon: '🎧',
              badge: 'Free',
              onClick: () => onNavigate ? onNavigate('daily-audio') : undefined,
            },
            {
              id: 'async-qa',
              title: 'Ask Voice',
              subtitle: 'Pandit Reply',
              icon: '🎙️',
              badge: '₹99',
              onClick: () => setOpenAsyncQuestionModal(true),
            },
            {
              id: 'live-puja',
              title: 'Live Darshan',
              subtitle: 'Kashi / Ujjain',
              icon: '🔴',
              badge: 'Live',
              onClick: () => onNavigate ? onNavigate('live-puja') : undefined,
            },
            {
              id: 'milan',
              title: 'Kundli Milan',
              subtitle: '36-Guna Vivah',
              icon: '💍',
              badge: 'Match',
              onClick: () => onNavigate ? onNavigate('milan') : undefined,
            },
          ].map((svc) => (
            <button
              key={svc.id}
              onClick={svc.onClick}
              className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/70 hover:bg-orange-50 dark:hover:bg-orange-950/30 border border-stone-200/80 dark:border-stone-700/60 hover:border-orange-300 dark:hover:border-orange-700 transition group cursor-pointer text-center relative shadow-2xs"
            >
              {svc.badge && (
                <span className="absolute -top-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-400 text-stone-950 uppercase shadow-2xs">
                  {svc.badge}
                </span>
              )}
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                {svc.icon}
              </span>
              <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200 mt-1.5 leading-tight line-clamp-1">
                {svc.title}
              </span>
              <span className="text-[9px] text-stone-500 dark:text-stone-400 leading-none mt-0.5">
                {svc.subtitle}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Lentlo Feature Action Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {/* Emergency Tatkal VIP */}
        <button
          onClick={() => setOpenTatkalModal(true)}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition whitespace-nowrap cursor-pointer shrink-0 animate-pulse border border-amber-300/40"
        >
          <Zap className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
          <span>⚡ Tatkal VIP (Under 60s)</span>
        </button>

        {/* Prashna Kundli for unknown birth time */}
        {onOpenPrashna && (
          <button
            onClick={onOpenPrashna}
            className="px-4 py-2 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer shrink-0"
          >
            <Compass className="w-3.5 h-3.5 text-orange-600" />
            <span>🧭 No Birth Time? Prashna</span>
          </button>
        )}

        {/* Platform Tour */}
        <button
          onClick={() => setOpenOnboardingModal(true)}
          className="px-4 py-2 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer shrink-0 border border-stone-200 dark:border-stone-700"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>✨ How it Works</span>
        </button>

        <button
          onClick={() => {
            setSelectedBookingAstrologer(astrologers[0]);
            setOpenSlotBookingModal(true);
          }}
          className="px-4 py-2 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition whitespace-nowrap cursor-pointer shrink-0"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{t('dir_schedule_slot')}</span>
        </button>

        <button
          onClick={() => setOpenAsyncQuestionModal(true)}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition whitespace-nowrap cursor-pointer shrink-0"
        >
          <Mic className="w-3.5 h-3.5 text-amber-200" />
          <span>Ask Voice Note (₹99)</span>
        </button>

        {onOpenGiftCards && (
          <button
            onClick={onOpenGiftCards}
            className="px-4 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800 text-purple-800 dark:text-purple-300 text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer shrink-0"
          >
            <Gift className="w-3.5 h-3.5 text-purple-600" />
            <span>🎁 Shubh Shagun Gifts</span>
          </button>
        )}

        <button
          onClick={() => setOpenFairBillingModal(true)}
          className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer shrink-0"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t('dir_fair_billing_guarantee')}</span>
        </button>
      </div>

      {/* Search, Filter Tabs & Sort Controls */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('dir_search_placeholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 outline-hidden focus:ring-2 focus:ring-orange-500 border border-transparent dark:border-stone-700"
            />
          </div>

          {/* Quick Availability, Language, and Sort By */}
          <div className="flex items-center gap-2 overflow-x-auto shrink-0">
            <button
              onClick={() => setAvailabilityFilter((p) => (p === 'all' ? 'online' : 'all'))}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                availabilityFilter === 'online'
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${availabilityFilter === 'online' ? 'bg-white' : 'bg-emerald-500'} animate-pulse`} />
              <span>{t('dir_online_only')}</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 shrink-0">
              <Globe className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent text-stone-700 dark:text-stone-300 outline-hidden cursor-pointer pr-1"
                title="Filter astrologers by language"
              >
                <option value="All">All Languages</option>
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 outline-hidden cursor-pointer"
            >
              <option value="rating">{t('dir_sort_rating')}</option>
              <option value="experience">{t('dir_sort_experience')}</option>
              <option value="price_low">{t('dir_sort_price_low')}</option>
              <option value="orders">{t('dir_sort_orders')}</option>
            </select>
          </div>
        </div>

        {/* Specialty Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedSpecialty === spec
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Language Filter Pills Row */}
        <div className="pt-2.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-bold text-stone-500 dark:text-stone-400 shrink-0">
            <Globe className="w-3.5 h-3.5 text-orange-500" />
            <span>Language:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <button
              onClick={() => setSelectedLanguage('All')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition cursor-pointer ${
                selectedLanguage === 'All'
                  ? 'bg-orange-500 text-white font-bold shadow-2xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              All ({astrologers.length})
            </button>
            {availableLanguages.map((lang) => {
              const count = astrologers.filter((a) => a.languages.includes(lang)).length;
              return (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition cursor-pointer ${
                    selectedLanguage === lang
                      ? 'bg-orange-500 text-white font-bold shadow-2xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {lang} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Notice Banner with Reset */}
        {selectedLanguage !== 'All' && (
          <div className="flex items-center justify-between text-xs bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 rounded-xl px-3 py-1.5 text-orange-900 dark:text-orange-200 animate-in fade-in">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-orange-500" />
              <span>
                Browsing astrologers fluent in <strong className="font-bold underline">{selectedLanguage}</strong> ({filteredAstrologers.length} available)
              </span>
            </span>
            <button
              onClick={() => setSelectedLanguage('All')}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center gap-1 text-[11px] font-medium p-1 rounded cursor-pointer"
              title="Reset to All Languages"
            >
              <span>Clear</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Personalized Transit Nudges & Gochar Alerts (Lentlo Platform Differentiator) */}
      {showTransitNudges && transitNudges.length > 0 && (
        <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-600/10 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 border border-orange-200 dark:border-orange-950/80 rounded-3xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-orange-500 text-white">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    Live Planetary Transit Nudges for {activeFamilyProfile.name}
                  </h4>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-bold">
                    {activeFamilyProfile.relation} • {activeFamilyProfile.rashi}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Personalized Gochar analysis computed from your saved birth charts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setOpenFamilyModal(true)}
                className="text-xs text-orange-600 dark:text-orange-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Switch Chart</span>
              </button>
              <button
                onClick={() => setShowTransitNudges(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs cursor-pointer"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {transitNudges.map((nudge) => (
              <div
                key={nudge.id}
                className="bg-white dark:bg-stone-900/90 rounded-2xl p-3.5 border border-orange-200/60 dark:border-stone-800 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 truncate">
                      {nudge.planet}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                        nudge.impactScore === 'Positive'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : nudge.impactScore === 'Caution'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {nudge.impactScore}
                    </span>
                  </div>

                  <h5 className="font-semibold text-xs text-stone-800 dark:text-stone-200 line-clamp-1">
                    {nudge.transitTitle}
                  </h5>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    {nudge.description}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-stone-400">Till {nudge.validUntil}</span>
                  <button
                    onClick={() => {
                      if (astrologers[0]) handleStartConsult(astrologers[0], 'audio');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold transition cursor-pointer shrink-0"
                  >
                    Consult Acharya
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Astrologers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAstrologers.map((astro) => {
          const isOnline = astro.status === 'online';
          const isBusy = astro.status === 'busy';

          return (
            <div
              key={astro.id}
              className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative group"
            >
              {/* AI Astrologer, Celebrity, or Verified Expert Ribbon */}
              {astro.isAi ? (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-xs animate-pulse border border-amber-300/40">
                  <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
                  <span>24/7 AI Expert</span>
                </div>
              ) : astro.isCelebrity ? (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-stone-950 text-[10px] font-black uppercase tracking-wider shadow-xs border border-amber-300">
                  <Crown className="w-3 h-3 fill-stone-950" />
                  <span>Celebrity Expert</span>
                </div>
              ) : astro.verified ? (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-500/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 fill-emerald-500/20" />
                  <span>Verified Expert</span>
                </div>
              ) : (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[10px] font-semibold">
                  <Award className="w-3 h-3 text-amber-500" />
                  <span>Certified</span>
                </div>
              )}

              <div>
                {/* Astrologer Header: Avatar & Info */}
                <div className="flex items-start gap-4">
                  <div
                    onClick={() => setSelectedProfileAstrologer(astro)}
                    className="relative shrink-0 cursor-pointer group/avatar"
                    title={`View ${astro.name}'s verified profile`}
                  >
                    <img
                      src={astro.avatar}
                      alt={astro.name}
                      className="w-18 h-18 rounded-2xl object-cover border-2 border-orange-500/60 shadow-sm group-hover/avatar:border-orange-500 transition"
                    />

                    {/* Verified Checkmark Seal on Avatar Corner */}
                    {astro.verified && (
                      <span
                        className="absolute -top-1 -right-1 p-0.5 rounded-full bg-white dark:bg-stone-900 shadow-md ring-1 ring-emerald-500/40"
                        title="12Rashi Verified Astrologer"
                      >
                        <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </span>
                      </span>
                    )}

                    {/* Video Intro Play Button on Avatar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVideoAstro(astro);
                        setOpenVideoIntroModal(true);
                      }}
                      className="absolute -top-1 -left-1 p-1.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white shadow-md cursor-pointer transition transform hover:scale-110 flex items-center justify-center ring-2 ring-white dark:ring-stone-900"
                      title="Watch 30s verified video intro"
                    >
                      <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                    </button>

                    {/* Status Badge */}
                    <span
                      className={`absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white flex items-center gap-1 shadow-xs ${
                        isOnline
                          ? 'bg-emerald-500'
                          : isBusy
                          ? 'bg-amber-500'
                          : 'bg-stone-400'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>{isOnline ? 'Online' : isBusy ? 'Busy' : 'Away'}</span>
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3
                        onClick={() => setSelectedProfileAstrologer(astro)}
                        className="font-bold text-base text-stone-900 dark:text-stone-100 truncate cursor-pointer hover:text-orange-600 dark:hover:text-orange-400 transition"
                        title="Click to view full bio and verified credentials"
                      >
                        {astro.name}
                      </h3>
                      {astro.verified && (
                        <span
                          className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold shrink-0"
                          title="Verified Identity, Education & Credentials"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>Verified</span>
                        </span>
                      )}
                      {astro.experienceYears >= 20 && !astro.isAi && (
                        <span
                          className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold shrink-0"
                          title="Senior Master Jyotish (20+ Years Lineage)"
                        >
                          <Award className="w-2.5 h-2.5 text-amber-600" />
                          <span>Master</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-medium truncate mt-0.5">
                      {astro.title}
                    </p>

                    {/* Verified Education & Credential Tag */}
                    <div className="flex items-center gap-1 text-[10px] text-stone-500 dark:text-stone-400 mt-1 truncate">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold truncate flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{astro.education || 'Govt / Sanskrit University Certified'}</span>
                      </span>
                    </div>

                    {/* Rating & Orders */}
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-stone-500 dark:text-stone-400">
                      <span className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{astro.rating}</span>
                      </span>
                      <span>({(astro.reviewsCount / 1000).toFixed(1)}k {t('dir_reviews')})</span>
                      <span>•</span>
                      <span>{astro.experienceYears} {t('dir_exp_years')}</span>
                    </div>
                  </div>
                </div>

                {/* Specialties Chips & Category Badge */}
                <div className="mt-3 flex flex-wrap items-center gap-1">
                  {astro.categoryBadge && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-gradient-to-r from-orange-500/15 to-amber-500/15 text-orange-700 dark:text-orange-300 font-bold border border-orange-300/40 dark:border-orange-900/50">
                      ⚡ {astro.categoryBadge}
                    </span>
                  )}
                  {astro.specialties.slice(0, 3).map((spec) => (
                    <span
                      key={spec}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Remedy Prescription Highlight */}
                {astro.remedySpecialties && astro.remedySpecialties.length > 0 && (
                  <div className="mt-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-stone-800 dark:text-stone-200">
                    <div className="flex items-center justify-between text-[10px] font-bold text-amber-700 dark:text-amber-400 mb-0.5">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Key Remedy: {astro.remedySpecialties[0].title}</span>
                      </span>
                      <span className="text-orange-600 dark:text-orange-400 font-semibold">
                        {astro.remedySpecialties[0].category}
                      </span>
                    </div>
                    {astro.remedySpecialties[0].mantra && (
                      <p className="text-[10px] font-mono text-stone-600 dark:text-stone-300 truncate">
                        {astro.remedySpecialties[0].mantra}
                      </p>
                    )}
                  </div>
                )}

                {/* Languages */}
                <div className="mt-2 text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                  <span className="font-medium text-stone-700 dark:text-stone-300">{t('dir_languages')}</span>
                  <span>{astro.languages.join(', ')}</span>
                </div>

                {/* Short Bio */}
                <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                  {astro.about}
                </p>
              </div>

              {/* Consultation Pricing & Action Buttons */}
              <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                {/* Wait time notification */}
                {isBusy && (
                  <div className="mb-2 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Wait time: ~{astro.waitTimeMins} mins in queue</span>
                  </div>
                )}

                {/* Lentlo Value-Add Features: Video Intro & Scheduled Slot */}
                <div className="flex items-center gap-2 mb-2.5">
                  <button
                    onClick={() => {
                      setSelectedVideoAstro(astro);
                      setOpenVideoIntroModal(true);
                    }}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-orange-50 dark:bg-stone-800 hover:bg-orange-100 dark:hover:bg-stone-700 text-orange-700 dark:text-orange-300 text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer border border-orange-200/60 dark:border-stone-700"
                    title="Watch verified video intro clip"
                  >
                    <Play className="w-3 h-3 fill-orange-500 text-orange-500" />
                    <span>{t('dir_intro_btn')}</span>
                  </button>

                  <button
                    onClick={() => setSelectedProfileAstrologer(astro)}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer border border-stone-200 dark:border-stone-700"
                    title="View complete bio, credentials and reviews"
                  >
                    <span>{t('dir_profile_btn')}</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedBookingAstrologer(astro);
                      setOpenSlotBookingModal(true);
                    }}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer border border-amber-200 dark:border-amber-900"
                    title="Book guaranteed private slot with WhatsApp reminders"
                  >
                    <Calendar className="w-3 h-3 text-amber-600" />
                    <span>{t('dir_slot_btn')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Chat Button */}
                  <button
                    onClick={() => handleStartConsult(astro, 'chat')}
                    className="py-2 px-1.5 rounded-xl border border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-xs font-bold flex flex-col items-center justify-center transition cursor-pointer"
                  >
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{t('dir_chat_btn')}</span>
                    </div>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">
                      ₹{astro.chatRate}/m
                    </span>
                  </button>

                  {/* Call Button */}
                  <button
                    onClick={() => handleStartConsult(astro, 'audio')}
                    className="py-2 px-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold flex flex-col items-center justify-center shadow-xs transition cursor-pointer"
                  >
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{t('dir_call_btn')}</span>
                    </div>
                    <span className="text-[10px] text-orange-100 font-normal">
                      ₹{astro.callRate}/m
                    </span>
                  </button>

                  {/* Video Button */}
                  <button
                    onClick={() => handleStartConsult(astro, 'video')}
                    className="py-2 px-1.5 rounded-xl border border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-xs font-bold flex flex-col items-center justify-center transition cursor-pointer"
                  >
                    <div className="flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" />
                      <span>{t('dir_video_btn')}</span>
                    </div>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">
                      ₹{astro.videoRate}/m
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
