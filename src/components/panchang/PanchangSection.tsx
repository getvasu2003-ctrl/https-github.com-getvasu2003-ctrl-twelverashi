import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CITIES_PANCHANG } from '../../data/lentloFeaturesData.ts';
import {
  Calendar,
  Clock,
  Compass,
  Sun,
  Moon,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Flame,
  PhoneCall,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { LunarPhaseCalendar } from './LunarPhaseCalendar.tsx';
import { calculateMoonPhase, getUpcomingKeyLunarEvents, getCountdownBadge } from '../../utils/lunarCalculations.ts';

export const PanchangSection: React.FC<{ onConsultClick?: (topic?: string) => void }> = ({ onConsultClick }) => {
  const { panchangCity, setPanchangCity, setOpenSlotBookingModal, setOpenAsyncQuestionModal } = useApp();
  const [selectedCity, setSelectedCity] = useState<string>(panchangCity || 'Kolkata');
  const [activeSubTab, setActiveSubTab] = useState<'daily' | 'lunar'>('daily');

  const panchangData = CITIES_PANCHANG[selectedCity] || CITIES_PANCHANG['Kolkata'];
  const todayMoon = calculateMoonPhase(new Date());
  const { nextPurnima, nextAmavasya } = getUpcomingKeyLunarEvents(new Date());

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setPanchangCity(city);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs: Daily Panchang vs Lunar Phase Calendar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 bg-stone-100 dark:bg-stone-800/90 rounded-2xl border border-stone-200 dark:border-stone-700">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('daily')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeSubTab === 'daily'
                ? 'bg-white dark:bg-stone-900 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Daily Panchang & Choghadiya</span>
          </button>

          <button
            onClick={() => setActiveSubTab('lunar')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeSubTab === 'lunar'
                ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Moon className="w-4 h-4 text-amber-500" />
            <span>Lunar Phase Calendar (Purnima & Amavasya)</span>
          </button>
        </div>

        {activeSubTab === 'daily' && (
          <div className="hidden lg:flex items-center gap-2 text-xs px-3 py-1 text-stone-500">
            <span>Drik Siddhanta</span>
            <span aria-hidden="true">·</span>
            <span>City: {selectedCity}</span>
          </div>
        )}
      </div>

      {activeSubTab === 'lunar' ? (
        <LunarPhaseCalendar onConsultClick={onConsultClick} />
      ) : (
        <>
      {/* Header Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-amber-100 text-xs font-bold mb-3 border border-amber-200/30">
            <Compass className="w-3.5 h-3.5 text-amber-200" />
            <span>Vedic Drik Siddhanta Astronomical Ephemeris</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
            Daily Vedic Panchang & Shubh Choghadiya
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-amber-50/90 leading-relaxed">
            Authentic five-limbed Hindu calendar (Tithi, Vaar, Nakshatra, Yoga, Karana) with real-time Rahu Kaal, Abhijit Muhurat, and auspicious Choghadiya periods for your city.
          </p>
        </div>

        {/* City Switcher in Banner */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1 relative z-10">
          <span className="text-xs font-bold text-amber-100 flex items-center gap-1 shrink-0">
            <MapPin className="w-3.5 h-3.5" />
            <span>Select City:</span>
          </span>
          {Object.keys(CITIES_PANCHANG).map((city) => (
            <button
              key={city}
              onClick={() => handleCityChange(city)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap shadow-xs ${
                selectedCity === city
                  ? 'bg-white text-orange-600 ring-2 ring-amber-300'
                  : 'bg-black/25 text-white hover:bg-black/35'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Date & Sun/Moon Status Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="space-y-1">
          <span className="text-stone-400 block font-semibold">Today's Date & Location</span>
          <span className="font-bold text-stone-900 dark:text-stone-100 block sm:text-sm">
            {panchangData.date}
          </span>
          <span className="text-[11px] text-orange-600 font-medium">{panchangData.city}</span>
        </div>

        <div className="space-y-1">
          <span className="text-stone-400 block font-semibold flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Surya (Sun) Timings</span>
          </span>
          <div className="font-bold text-stone-900 dark:text-stone-100">
            Rise: {panchangData.sunrise} • Set: {panchangData.sunset}
          </div>
          <span className="text-[11px] text-stone-500">Day length: ~12 hrs 04 mins</span>
        </div>

        <div className="space-y-1">
          <span className="text-stone-400 block font-semibold flex items-center gap-1">
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Chandra (Moon) Timings</span>
          </span>
          <div className="font-bold text-stone-900 dark:text-stone-100">
            Moonrise: {panchangData.moonrise}
          </div>
          <span className="text-[11px] text-stone-500">{panchangData.paksha}</span>
        </div>

        <div className="space-y-1">
          <span className="text-stone-400 block font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Golden Abhijit Muhurat</span>
          </span>
          <div className="font-bold text-emerald-600 dark:text-emerald-400">
            {panchangData.abhijitMuhurat}
          </div>
          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
            Best for new undertakings
          </span>
        </div>
      </div>

      {/* Quick Lunar Phase Banner on Daily View */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-5 border border-indigo-800/50 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl shrink-0 shadow-inner">
            {todayMoon.icon}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300">Lunar Ephemeris</span>
              <span className="text-stone-400">·</span>
              <span className="text-xs text-stone-300 font-semibold">{todayMoon.paksha}</span>
            </div>
            <div className="text-sm font-bold text-stone-100 flex items-center gap-2">
              <span>{todayMoon.phaseName} ({todayMoon.illuminationPct}% illuminated)</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-300">
              {nextPurnima && (
                <span>🌕 Purnima: <strong className="text-amber-300">{nextPurnima.nameEn.split('(')[0].trim()}</strong> ({getCountdownBadge(nextPurnima.date).text})</span>
              )}
              {nextAmavasya && (
                <>
                  <span>·</span>
                  <span>🌑 Amavasya: <strong className="text-indigo-300">{nextAmavasya.nameEn.split('(')[0].trim()}</strong> ({getCountdownBadge(nextAmavasya.date).text})</span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveSubTab('lunar')}
          className="self-start sm:self-auto py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer shrink-0"
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Open Lunar Calendar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* The 5 Pillars (Pancha Anga) Grid */}
      <div>
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
          <span>The Five Auspicious Limbs (पञ्चाङ्ग विवरण)</span>
          <span className="text-xs font-normal text-stone-500">Accurate Vedic Standard</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Tithi */}
          <div className="p-4 rounded-2xl bg-orange-50/40 dark:bg-stone-900 border border-orange-200 dark:border-stone-800 space-y-1.5">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest block">1. Tithi (तिथी)</span>
            <div className="font-bold text-sm text-stone-900 dark:text-stone-100">{panchangData.tithi}</div>
            <p className="text-[11px] text-stone-500">{panchangData.tithiEndTime}</p>
          </div>

          {/* Nakshatra */}
          <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-stone-900 border border-amber-200 dark:border-stone-800 space-y-1.5">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">2. Nakshatra (नक्षत्र)</span>
            <div className="font-bold text-sm text-stone-900 dark:text-stone-100">{panchangData.nakshatra}</div>
            <p className="text-[11px] text-stone-500">{panchangData.nakshatraEndTime}</p>
          </div>

          {/* Yoga */}
          <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-stone-900 border border-emerald-200 dark:border-stone-800 space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">3. Yoga (योग)</span>
            <div className="font-bold text-sm text-stone-900 dark:text-stone-100">{panchangData.yoga}</div>
            <p className="text-[11px] text-stone-500">Energizes auspicious deeds</p>
          </div>

          {/* Karana */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">4. Karana (करण)</span>
            <div className="font-bold text-sm text-stone-900 dark:text-stone-100">{panchangData.karana}</div>
            <p className="text-[11px] text-stone-500">Half of a Tithi cycle</p>
          </div>

          {/* Vaar */}
          <div className="p-4 rounded-2xl bg-orange-50/40 dark:bg-stone-900 border border-orange-200 dark:border-stone-800 space-y-1.5">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest block">5. Vaar (वार)</span>
            <div className="font-bold text-sm text-stone-900 dark:text-stone-100">{panchangData.vaar}</div>
            <p className="text-[11px] text-stone-500">Ruled by Budha (Mercury)</p>
          </div>
        </div>
      </div>

      {/* Inauspicious & Auspicious Periods Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rahu Kaal Alert */}
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-stone-900 border border-rose-200 dark:border-stone-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Rahu Kaal (Avoid Major Tasks)</span>
          </div>
          <div className="text-base font-mono font-bold text-rose-800 dark:text-rose-300">
            {panchangData.rahuKaal}
          </div>
          <p className="text-[11px] text-stone-500 leading-tight">
            Avoid signing contracts, purchasing vehicle/gold, or starting travel.
          </p>
        </div>

        {/* Yamaganda */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300">
            <Clock className="w-4 h-4 text-stone-500" />
            <span>Yamaganda Kaal</span>
          </div>
          <div className="text-base font-mono font-bold text-stone-900 dark:text-stone-100">
            {panchangData.yamaganda}
          </div>
          <p className="text-[11px] text-stone-500 leading-tight">
            Time ruled by Yama. Not recommended for marriage or travel.
          </p>
        </div>

        {/* Gulika Kaal */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-stone-900 border border-amber-200 dark:border-stone-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Gulika Kaal</span>
          </div>
          <div className="text-base font-mono font-bold text-amber-800 dark:text-amber-300">
            {panchangData.gulikaKaal}
          </div>
          <p className="text-[11px] text-stone-500 leading-tight">
            Any work done in Gulika tends to repeat; beneficial for savings.
          </p>
        </div>
      </div>

      {/* Shubh Choghadiya Day Table */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
              Day Choghadiya Muhurat (दिन का चौघड़िया)
            </h3>
            <p className="text-xs text-stone-500">
              Seven distinct planetary divisions for selecting the perfect moment for your auspicious activities.
            </p>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-bold self-start sm:self-auto">
            Surya Lagna Alignment
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {panchangData.choghadiya.map((chog, i) => (
            <div
              key={i}
              className={`p-3 rounded-2xl border transition flex items-center justify-between ${
                chog.isAuspicious
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                  : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700'
              }`}
            >
              <div>
                <span className="text-[11px] font-mono text-stone-500 block">{chog.period}</span>
                <span className="font-bold text-sm text-stone-900 dark:text-stone-100">{chog.type}</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  chog.isAuspicious
                    ? 'bg-emerald-500 text-white'
                    : 'bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                {chog.isAuspicious ? 'SHUBH' : 'AVOID'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Lentlo Conversion Anchor: Every Free Tool Ends with "Ask an Astrologer" */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block">
            Personal Muhurat Calculation
          </span>
          <h4 className="text-base sm:text-lg font-bold">
            Need an Auspicious Muhurat for Wedding, Griha Pravesh or Business Launch?
          </h4>
          <p className="text-xs text-orange-100">
            Consult our verified Vedic Acharyas live to calculate your Lagna-specific Shubh Muhurat.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (onConsultClick) onConsultClick();
              else setOpenSlotBookingModal(true);
            }}
            className="py-2.5 px-4 rounded-xl bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Book Muhurat Slot</span>
          </button>

          <button
            onClick={() => setOpenAsyncQuestionModal(true)}
            className="py-2.5 px-4 rounded-xl bg-black/20 hover:bg-black/30 text-white font-bold text-xs flex items-center gap-1.5 border border-white/30 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Ask Voice Note (₹99)</span>
          </button>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

