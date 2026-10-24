import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { KundliSummary } from '../../types/astrology.ts';
import { audioSynthesis } from '../../services/audioSynthesisService.ts';
import {
  Compass,
  Calendar,
  Clock,
  MapPin,
  User,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Download,
  PhoneCall,
  Edit3,
  RotateCcw,
  Volume2,
  Star,
  Award,
  Flame,
  Check,
  Cloud,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

interface MyAstroProfileProps {
  onNavigateTab?: (tab: string) => void;
  isModalView?: boolean;
  onCloseModal?: () => void;
}

const POPULAR_CITIES = [
  'New Delhi, Delhi',
  'Mumbai, Maharashtra',
  'Kolkata, West Bengal',
  'Varanasi, Uttar Pradesh',
  'Bengaluru, Karnataka',
  'Jaipur, Rajasthan',
  'Haridwar, Uttarakhand',
  'Ahmedabad, Gujarat',
  'Chennai, Tamil Nadu',
  'Hyderabad, Telangana',
  'Pune, Maharashtra',
  'Ayodhya, Uttar Pradesh',
  'Ujjain, Madhya Pradesh',
];

export const MyAstroProfile: React.FC<MyAstroProfileProps> = ({
  onNavigateTab,
  isModalView = false,
  onCloseModal,
}) => {
  const {
    user,
    userProfile,
    isUserLoggedIn,
    setOpenLoginModal,
    saveAstroProfile,
    setOpenKundliPdfModal,
    addNotification,
  } = useApp();

  // Determine if a permanent Kundli summary already exists
  const existingSummary: KundliSummary | null =
    user?.kundliSummary ||
    (() => {
      try {
        const stored = localStorage.getItem('12rashi_guest_kundli_summary');
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    })();

  const [isEditing, setIsEditing] = useState<boolean>(!existingSummary);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [isPlayingMantra, setIsPlayingMantra] = useState<boolean>(false);

  // Form states initialized with user or userProfile data
  const [name, setName] = useState<string>(user?.name || userProfile?.name || 'Astro Seeker');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(
    (user?.gender as any) || (userProfile?.gender?.toLowerCase() as any) || 'male'
  );
  const [dob, setDob] = useState<string>(user?.dob || userProfile?.dob || '1995-08-15');
  const [tob, setTob] = useState<string>(user?.tob || userProfile?.tob || '10:30');
  const [pob, setPob] = useState<string>(user?.pob || userProfile?.pob || 'Varanasi, Uttar Pradesh');

  const [activeSummary, setActiveSummary] = useState<KundliSummary | null>(existingSummary);

  useEffect(() => {
    if (user?.kundliSummary) {
      setActiveSummary(user.kundliSummary);
    }
  }, [user?.kundliSummary]);

  const handleGenerateAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dob || !tob || !pob.trim()) {
      addNotification('Incomplete Details', 'Please provide birth date, time, and city to cast your Janam Kundli.', 'discount');
      return;
    }

    setIsCalculating(true);
    audioSynthesis.playTempleBell(587, 0.6);

    try {
      const summary = await saveAstroProfile({
        name: name.trim(),
        gender,
        dob,
        tob,
        pob: pob.trim(),
      });

      setActiveSummary(summary);
      setIsEditing(false);
      audioSynthesis.playTempleBell(880, 1.4);
    } catch (err: any) {
      console.error(err);
      addNotification('Calculation Error', 'Could not cast Kundli. Please verify details.', 'discount');
    } finally {
      setIsCalculating(false);
    }
  };

  const handlePlayMantra = () => {
    if (isPlayingMantra) {
      audioSynthesis.stopSpeaking();
      setIsPlayingMantra(false);
      return;
    }

    if (!activeSummary?.mantra) return;

    setIsPlayingMantra(true);
    audioSynthesis.playTempleBell(1046, 1.0);
    const chant = `Hari Om. Your prescribed Vedic Beej Mantra is: ${activeSummary.mantra}. Chant this sacred sound 108 times daily at sunrise to activate your Lagna Lord ${activeSummary.ascendantLord} and alleviate malefic transits.`;
    audioSynthesis.speakNarration(chant, {
      lang: 'hi-IN',
      rate: 0.95,
      pitch: 1.0,
      onEnd: () => setIsPlayingMantra(false),
    });
  };

  const handleShareKundli = () => {
    if (!activeSummary) return;

    const shareText =
      `🌟 *My Permanent Janam Kundli Blueprint (12Rashi)* 🌟\n\n` +
      `👤 Name: ${name}\n` +
      `🕉️ Ascendant (Lagna): ${activeSummary.ascendant} (Lord: ${activeSummary.ascendantLord})\n` +
      `🌙 Moon Sign (Rashi): ${activeSummary.moonSign} (Lord: ${activeSummary.moonSignLord})\n` +
      `☀️ Sun Sign: ${activeSummary.sunSign}\n` +
      `⭐ Birth Nakshatra: ${activeSummary.nakshatra} (Pada ${activeSummary.charan})\n` +
      `⏳ Current Mahadasha: ${activeSummary.currentMahadasha}\n` +
      `🛡️ Manglik Status: ${activeSummary.manglikStatus}\n` +
      `🍀 Lucky Gemstone: ${activeSummary.luckyGemstone} | Lucky Number: ${activeSummary.luckyNumber}\n` +
      `📿 Ishta Devata: ${activeSummary.deity}\n\n` +
      `Calculate your accurate Vedic Janam Kundli on 12Rashi: https://12rashi.com`;

    if (navigator.share) {
      navigator.share({
        title: `${name}'s Janam Kundli Summary`,
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
      addNotification('Copied to Clipboard', 'Kundli summary copied. Ready to share on WhatsApp.', 'muhurat');
    }
  };

  return (
    <div className={`space-y-6 ${isModalView ? 'p-1' : ''}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-amber-200 text-xs font-bold border border-amber-300/30">
            <Compass className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
            <span>Permanent Cosmic Identity & Profile Kundli</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight">
            My Astro Profile (मेरी जन्म कुण्डली)
          </h1>

          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed max-w-2xl">
            Save your verified Vedic birth coordinates once. 12Rashi permanently links your D1 Lagna chart, Nakshatra Pada, and Mahadasha cycles to your profile for seamless consultation recommendations and daily forecast tuning.
          </p>

          {/* Sync & Account Pill */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${
              isUserLoggedIn
                ? 'bg-emerald-500/25 border border-emerald-400/40 text-emerald-200'
                : 'bg-black/25 border border-amber-300/30 text-amber-200'
            }`}>
              <Cloud className="w-3.5 h-3.5" />
              <span>
                {isUserLoggedIn
                  ? `Cloud Synced to Firestore (+91 ${user?.phone})`
                  : 'Stored Locally on Device'}
              </span>
            </div>

            {!isUserLoggedIn && (
              <button
                type="button"
                onClick={() => setOpenLoginModal(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-orange-950 font-bold hover:bg-amber-100 transition cursor-pointer shadow-xs"
              >
                <span>Sign In to Cloud Backup</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {activeSummary && (
              <span className="text-[11px] text-amber-200/80 font-mono ml-auto">
                Generated: {new Date(activeSummary.generatedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Container: Form vs Display Mode */}
      {isEditing ? (
        /* BIRTH DETAILS INPUT FORM */
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 font-serif">
                Enter Accurate Birth Details
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Microsecond Chitrapaksha Lahiri ephemeris computation based on your hospital birth record.
              </p>
            </div>

            {activeSummary && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleGenerateAndSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-orange-600" />
                  <span>Full Name (नाम)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vasu Sharma"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-orange-500 outline-hidden"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <span>Gender (लिंग)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['male', 'female', 'other'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition cursor-pointer border ${
                        gender === g
                          ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-600" />
                  <span>Date of Birth (जन्म तिथि)</span>
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-orange-500 outline-hidden"
                />
              </div>

              {/* Time of Birth */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-orange-600" />
                    <span>Time of Birth (जन्म समय)</span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-normal">24-hour format</span>
                </label>
                <input
                  type="time"
                  value={tob}
                  onChange={(e) => setTob(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-orange-500 outline-hidden"
                />
              </div>
            </div>

            {/* Place of Birth */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                <span>Place of Birth (जन्म स्थान)</span>
              </label>
              <input
                type="text"
                value={pob}
                onChange={(e) => setPob(e.target.value)}
                placeholder="e.g. Varanasi, Uttar Pradesh"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-orange-500 outline-hidden"
              />

              {/* Quick Tap Popular City Pills */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 block">
                  Quick Select Sacred & Metro Cities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_CITIES.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setPob(city)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                        pob === city
                          ? 'bg-orange-100 dark:bg-orange-950 border-orange-400 text-orange-800 dark:text-orange-200 font-bold'
                          : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                      }`}
                    >
                      {city.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isCalculating}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-extrabold text-sm shadow-md transition transform hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isCalculating
                    ? 'Calculating Parashari Planetary Coordinates...'
                    : 'Calculate & Save Permanent Janam Kundli'}
                </span>
              </button>
            </div>
          </form>
        </div>
      ) : activeSummary ? (
        /* SAVED PERMANENT KUNDLI SUMMARY DASHBOARD */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-orange-600 font-bold">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong className="text-stone-900 dark:text-stone-100 block">
                  {name}
                </strong>
                <span className="text-[11px] text-stone-500">
                  DOB: {dob} • {tob} IST • {pob}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Edit Birth Date, Time or Location"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>

              <button
                type="button"
                onClick={handleShareKundli}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Share Kundli Summary on WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedShare ? 'Copied!' : 'Share WhatsApp'}</span>
              </button>

              <button
                type="button"
                onClick={() => setOpenKundliPdfModal(true)}
                className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Download 50+ Page Brihat Kundli PDF Dossier"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Brihat PDF</span>
              </button>
            </div>
          </div>

          {/* 4 Core Cosmic Pillars Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* ASCENDANT (LAGNA) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-stone-900 dark:to-stone-850 border border-orange-200 dark:border-stone-700/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 block tracking-wider">
                ASCENDANT (लग्न)
              </span>
              <strong className="text-base sm:text-lg font-serif font-black text-stone-900 dark:text-stone-100 block">
                {activeSummary.ascendant}
              </strong>
              <span className="text-xs text-stone-600 dark:text-stone-400 block">
                Lord: <strong>{activeSummary.ascendantLord}</strong>
              </span>
            </div>

            {/* MOON SIGN (RASHI) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-stone-900 dark:to-stone-850 border border-amber-200 dark:border-stone-700/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block tracking-wider">
                MOON SIGN (चन्द्र राशि)
              </span>
              <strong className="text-base sm:text-lg font-serif font-black text-stone-900 dark:text-stone-100 block">
                {activeSummary.moonSign}
              </strong>
              <span className="text-xs text-stone-600 dark:text-stone-400 block">
                Lord: <strong>{activeSummary.moonSignLord}</strong>
              </span>
            </div>

            {/* SUN SIGN */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50 dark:from-stone-900 dark:to-stone-850 border border-rose-200 dark:border-stone-700/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 block tracking-wider">
                SUN SIGN (सूर्य राशि)
              </span>
              <strong className="text-base sm:text-lg font-serif font-black text-stone-900 dark:text-stone-100 block">
                {activeSummary.sunSign}
              </strong>
              <span className="text-xs text-stone-600 dark:text-stone-400 block">
                Atmakaraka Soul Axis
              </span>
            </div>

            {/* NAKSHATRA */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-stone-900 dark:to-stone-850 border border-purple-200 dark:border-stone-700/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 block tracking-wider">
                NAKSHATRA (नक्षत्र)
              </span>
              <strong className="text-base sm:text-lg font-serif font-black text-stone-900 dark:text-stone-100 block">
                {activeSummary.nakshatra}
              </strong>
              <span className="text-xs text-stone-600 dark:text-stone-400 block">
                Pada {activeSummary.charan} • Lord: <strong>{activeSummary.nakshatraLord}</strong>
              </span>
            </div>
          </div>

          {/* ASHTAKOOT ATTRIBUTES & DASHA TIMELINE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ashtakoot Attribute Blueprint */}
            <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-orange-500" />
                <span>Ashtakoot Compatibility Markers (अष्टकूट तत्व)</span>
              </h3>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-400 block font-bold">VARNA</span>
                  <strong className="text-xs text-stone-800 dark:text-stone-200 mt-0.5 block">{activeSummary.varna.split(' ')[0]}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-400 block font-bold">VASHYA</span>
                  <strong className="text-xs text-stone-800 dark:text-stone-200 mt-0.5 block">{activeSummary.vashya.split(' ')[0]}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-400 block font-bold">YONI</span>
                  <strong className="text-xs text-stone-800 dark:text-stone-200 mt-0.5 block">{activeSummary.yoni.split(' ')[0]}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-400 block font-bold">GANA</span>
                  <strong className="text-xs text-stone-800 dark:text-stone-200 mt-0.5 block">{activeSummary.gana.split(' ')[0]}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-400 block font-bold">NADI</span>
                  <strong className="text-xs text-stone-800 dark:text-stone-200 mt-0.5 block">{activeSummary.nadi.split(' ')[0]}</strong>
                </div>
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed pt-1">
                Your Nadi & Yoni blueprint governs innate temperament, health constitution, and 36-Guna Kundli Milan compatibility for marriage.
              </p>
            </div>

            {/* Active Vimshottari Mahadasha */}
            <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Current Vimshottari Mahadasha (दशा काल)</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                  Active
                </span>
              </h3>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-stone-800/70 border border-amber-200 dark:border-stone-700 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-stone-900 dark:text-stone-100">
                    Mahadasha: <strong className="text-orange-600">{activeSummary.currentMahadasha}</strong>
                  </span>
                  <span className="text-stone-600 dark:text-stone-400 font-mono text-[11px]">
                    Sub-Period: {activeSummary.currentAntardasha}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                  Current planetary period activates professional growth, foreign connections, and material stability. Favorable window for investments.
                </p>
              </div>

              {/* Doshas Row */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-0.5">
                <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-400 block font-bold">MANGLIK</span>
                  <span className={`text-[11px] font-bold mt-0.5 block ${
                    activeSummary.manglikStatus?.includes('Present') ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {activeSummary.manglikStatus?.includes('Present') ? 'Present' : 'Non-Manglik'}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-400 block font-bold">KALSARPA</span>
                  <span className="text-[11px] text-emerald-600 font-bold mt-0.5 block">
                    {activeSummary.kalsarpaStatus?.includes('Absent') ? 'Absent (शुभ)' : 'Remedy Active'}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-400 block font-bold">SADE SATI</span>
                  <span className="text-[11px] text-stone-700 dark:text-stone-300 font-bold mt-0.5 block">
                    {activeSummary.sadeSatiStatus?.includes('Phase') ? 'Phase Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SHUBH (AUSPICIOUS) REMEDIAL & LIFE COORDINATES */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Personalized Shubh Coordinates & Remedial Blueprint (शुभ उपाय)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Lucky Number</span>
                <strong className="text-base text-orange-600 mt-0.5 block">{activeSummary.luckyNumber}</strong>
                <span className="text-[10px] text-stone-500">Root vibration</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Lucky Gemstone</span>
                <strong className="text-xs text-amber-600 mt-0.5 block">{activeSummary.luckyGemstone}</strong>
                <span className="text-[10px] text-stone-500">For D1 Lagna strength</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Lucky Color</span>
                <strong className="text-xs text-stone-800 dark:text-stone-200 mt-0.5 block">{activeSummary.luckyColor}</strong>
                <span className="text-[10px] text-stone-500">Aura harmony</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Favorable Direction</span>
                <strong className="text-xs text-stone-800 dark:text-stone-200 mt-0.5 block">{activeSummary.luckyDirection}</strong>
                <span className="text-[10px] text-stone-500">For home workspace</span>
              </div>
            </div>

            {/* Prescribed Vedic Beej Mantra & Audio Player */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-stone-800/80 dark:via-stone-800 dark:to-stone-800/80 border border-amber-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    Prescribed Beej Mantra:
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-serif font-extrabold bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200">
                    {activeSummary.mantra}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Dedicated to {activeSummary.deity}. Chant 108 times at sunrise for peace, intellect, and obstacle removal.
                </p>
              </div>

              <button
                type="button"
                onClick={handlePlayMantra}
                className="py-2 px-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingMantra ? 'Stop Chant' : 'Listen Mantra'}</span>
              </button>
            </div>
          </div>

          {/* Direct Consultation Link CTA Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-amber-200" />
                <h4 className="font-bold text-base">
                  Consult a Certified Acharya with this Janam Kundli
                </h4>
              </div>
              <p className="text-xs text-amber-100 max-w-xl">
                Your birth details will be automatically attached so the pandit can analyze your 12 bhavas and Mahadasha immediately without wasting paid consultation minutes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onCloseModal) onCloseModal();
                if (onNavigateTab) onNavigateTab('astrologers');
              }}
              className="py-2.5 px-5 rounded-xl bg-white text-orange-950 font-extrabold text-xs shadow-lg hover:bg-amber-100 transition transform hover:scale-105 cursor-pointer shrink-0"
            >
              Connect with Astrologer
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
