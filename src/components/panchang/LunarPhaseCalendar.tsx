import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { LunarPhaseEvent, LunarCalendarDay } from '../../types/astrology.ts';
import { LUNAR_PHASE_EVENTS, VEDIC_LUNAR_RITUAL_GUIDES } from '../../data/lunarCalendarData.ts';
import {
  calculateMoonPhase,
  getCalendarDaysForMonth,
  getUpcomingKeyLunarEvents,
  getCountdownBadge,
  formatDateKey,
} from '../../utils/lunarCalculations.ts';
import { audioSynthesis } from '../../services/audioSynthesisService.ts';
import {
  Moon,
  Calendar,
  Sparkles,
  PhoneCall,
  Bell,
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
  Volume2,
  VolumeX,
  BookOpen,
  AlertTriangle,
  ShieldCheck,
  Heart,
  Info,
  Clock,
  Flame,
  ArrowRight,
  Compass,
} from 'lucide-react';

interface LunarPhaseCalendarProps {
  onConsultClick?: (topic?: string) => void;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const LunarPhaseCalendar: React.FC<LunarPhaseCalendarProps> = ({ onConsultClick }) => {
  const { addNotification, setOpenSlotBookingModal, setOpenAsyncQuestionModal } = useApp();

  // Current system date or default Vedic calendar anchor (October 2026)
  const today = useMemo(() => new Date(), []);
  // Start view on current month/year or next active lunar cycle
  const [currentYear, setCurrentYear] = useState<number>(() => {
    // If today is before 2026, default to 2026 for rich upcoming festivals
    return today.getFullYear() < 2026 ? 2026 : today.getFullYear();
  });
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(() => {
    return today.getFullYear() < 2026 ? 9 : today.getMonth(); // October index is 9
  });

  // Filter for calendar days
  const [filterType, setFilterType] = useState<'all' | 'full_moon' | 'new_moon' | 'vrats'>('all');

  // Selected date modal / details flyout
  const [selectedDay, setSelectedDay] = useState<LunarCalendarDay | null>(null);

  // Copied state indicator
  const [copiedMantraId, setCopiedMantraId] = useState<string | null>(null);

  // Audio playing state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [playingEventId, setPlayingEventId] = useState<string | null>(null);

  // Chandra Mantra Japa counter
  const [japaCount, setJapaCount] = useState<number>(0);
  const [japaTarget, setJapaTarget] = useState<11 | 21 | 108>(21);

  // Active guide tab
  const [activeGuideIndex, setActiveGuideIndex] = useState<number>(0);

  // Today's real astronomical moon calculation
  const todayMoon = useMemo(() => calculateMoonPhase(today), [today]);

  // Upcoming Purnima and Amavasya spotlights
  const { nextPurnima, nextAmavasya, upcomingList } = useMemo(() => {
    return getUpcomingKeyLunarEvents(today);
  }, [today]);

  // Days for the selected month
  const calendarDays = useMemo(() => {
    return getCalendarDaysForMonth(currentYear, currentMonthIndex);
  }, [currentYear, currentMonthIndex]);

  // Handle Month Navigation
  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonthIndex((m) => m + 1);
    }
  };

  const handleResetToCurrent = () => {
    const yr = today.getFullYear() < 2026 ? 2026 : today.getFullYear();
    const mo = today.getFullYear() < 2026 ? 9 : today.getMonth();
    setCurrentYear(yr);
    setCurrentMonthIndex(mo);
  };

  // Copy Mantra Helper
  const handleCopyMantra = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMantraId(id);
    addNotification('Mantra Copied', 'Sacred Vedic text copied to clipboard for your chanting sadhana.');
    setTimeout(() => setCopiedMantraId(null), 2500);
  };

  // Play Vedic Mantra / Pronunciation
  const handleTogglePlayMantra = (event: LunarPhaseEvent) => {
    if (isPlayingAudio && playingEventId === event.id) {
      audioSynthesis.stopSpeaking();
      setIsPlayingAudio(false);
      setPlayingEventId(null);
      return;
    }

    audioSynthesis.stopSpeaking();
    setIsPlayingAudio(true);
    setPlayingEventId(event.id);

    audioSynthesis.playTempleBell(528, 2.5);

    const spokenText = `${event.nameHi}. ${event.mantra.sanskrit}. ${event.mantra.meaning}`;
    audioSynthesis.speakNarration(spokenText, {
      lang: 'hi-IN',
      rate: 0.88,
      onEnd: () => {
        setIsPlayingAudio(false);
        setPlayingEventId(null);
      },
    });
  };

  // Set Reminder Notification
  const handleSetReminder = (event: LunarPhaseEvent) => {
    audioSynthesis.playTempleBell(720, 1.2);
    addNotification(
      `🔔 Ritual Reminder: ${event.nameEn}`,
      `Auspicious Tithi on ${event.formattedDate}. Tithi Window: ${event.tithiWindow}. Prescribed Daan: ${event.prescribedDaan[0]}.`
    );
  };

  // Open Consultation Booking with Context
  const handleBookTithiConsultation = (event: LunarPhaseEvent) => {
    if (onConsultClick) {
      onConsultClick(`Tithi Ritual: ${event.nameEn}`);
    } else {
      setOpenSlotBookingModal(true);
    }
  };

  // Increment Japa Counter
  const handleIncrementJapa = () => {
    audioSynthesis.playTempleBell(432 + (japaCount % 8) * 20, 0.8);
    const nextVal = japaCount + 1;
    setJapaCount(nextVal);
    if (nextVal === japaTarget) {
      audioSynthesis.playSacredDrone(3.0);
      addNotification(
        '🙏 Japa Sadhana Completed!',
        `You have successfully chanted ${japaTarget} repetitions of the sacred Chandra Beej Mantra.`
      );
    }
  };

  const handleResetJapa = () => {
    setJapaCount(0);
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Banner & Current Moon Status */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-stone-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs text-amber-200/90 font-medium mb-3">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-700/50 backdrop-blur-md">
              <Moon className="w-3.5 h-3.5 text-amber-300" />
              <span>Vedic Chandra Siddhanta</span>
            </span>
            <span>·</span>
            <span>Tithi & Lunar Phasing</span>
            <span>·</span>
            <span>Ritual & Fasting Ephemeris</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
            Vedic Lunar Phase Calendar (चन्द्र पञ्चाङ्ग)
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
            In Vedic astrology, the Moon (चन्द्र) governs the human mind, emotions, and subtle karmic rhythms.
            Track upcoming <span className="text-amber-300 font-bold">Purnima (Full Moon)</span> and{' '}
            <span className="text-indigo-300 font-bold">Amavasya (New Moon)</span> dates to align your Satyanarayan Pujas,
            Pitru Tarpana, fasting (Vrat), and astrologer consultations with celestial peak energies.
          </p>
        </div>

        {/* Current Moon Phase Quick Bar */}
        <div className="mt-6 pt-5 border-t border-indigo-900/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-stone-400 block text-[11px] font-semibold">Today's Moon Phase</span>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-2xl">{todayMoon.icon}</span>
              <div>
                <span className="font-bold text-stone-100 block">{todayMoon.phaseName}</span>
                <span className="text-[11px] text-amber-300">{todayMoon.phaseNameHi}</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-stone-400 block text-[11px] font-semibold">Illumination & Age</span>
            <div className="mt-0.5 font-bold text-stone-100 text-sm">
              {todayMoon.illuminationPct}% Illuminated
            </div>
            <span className="text-[11px] text-stone-400">Day {todayMoon.ageDays} of 29.5 synodic cycle</span>
          </div>

          <div>
            <span className="text-stone-400 block text-[11px] font-semibold">Current Paksha & Tithi</span>
            <div className="mt-0.5 font-bold text-amber-200 text-sm">{todayMoon.paksha}</div>
            <span className="text-[11px] text-stone-300">{todayMoon.tithiName}</span>
          </div>

          <div>
            <span className="text-stone-400 block text-[11px] font-semibold">Primary Ritual Focus</span>
            <div className="mt-0.5 font-bold text-emerald-400 text-sm">
              {todayMoon.isPurnima
                ? '🌕 Satyanarayan & Lakshmi Puja'
                : todayMoon.isAmavasya
                ? '🌑 Pitru Tarpana & Silence'
                : todayMoon.paksha === 'Shukla Paksha'
                ? '✨ Expansion & New Ventures'
                : '🧘 Introspection & Cleansing'}
            </div>
            <span className="text-[11px] text-stone-400">Vedic Drik Ephemeris</span>
          </div>
        </div>
      </div>

      {/* 2. Twin Spotlight Cards: Next Full Moon (Purnima) & Next New Moon (Amavasya) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Next Purnima Card */}
        {nextPurnima && (
          <div className="relative rounded-3xl p-6 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white dark:to-stone-900 border border-amber-300/60 dark:border-amber-700/50 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🌕</span>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-amber-400 block">
                      Upcoming Full Moon (पूर्णिमा)
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug">
                      {nextPurnima.nameEn}
                    </h3>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                  {getCountdownBadge(nextPurnima.date, today).text}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-200/80 dark:border-stone-700 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Date:</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">{nextPurnima.formattedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Vedic Month:</span>
                  <span className="font-semibold text-amber-700 dark:text-amber-400">{nextPurnima.vedicMonth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Tithi Window:</span>
                  <span className="font-mono text-[11px] text-stone-700 dark:text-stone-300 text-right">
                    {nextPurnima.tithiWindow}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Nakshatra:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{nextPurnima.nakshatra}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed">
                {nextPurnima.spiritualSignificance}
              </p>

              {/* Quick Ritual & Daan */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide block">
                  Top Recommended Ritual:
                </span>
                <div className="flex items-start gap-1.5 text-stone-800 dark:text-stone-200 font-medium">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{nextPurnima.recommendedRituals[0]}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-amber-200/60 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => setSelectedDay({
                  date: new Date(nextPurnima.date),
                  dateString: nextPurnima.date,
                  dayOfMonth: parseInt(nextPurnima.date.split('-')[2], 10),
                  phaseType: 'full_moon',
                  phaseName: nextPurnima.nameEn,
                  illuminationPct: 100,
                  paksha: 'Shukla Paksha',
                  approxTithi: 'Purnima',
                  isPurnima: true,
                  isAmavasya: false,
                  isEkadashi: false,
                  event: nextPurnima,
                })}
                className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Ritual & Mantra</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSetReminder(nextPurnima)}
                  title="Set Reminder Notification"
                  className="p-2 rounded-xl bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-300 hover:bg-amber-200 transition cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleBookTithiConsultation(nextPurnima)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:from-amber-600 hover:to-orange-600 transition cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Book Consultation</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Next Amavasya Card */}
        {nextAmavasya && (
          <div className="relative rounded-3xl p-6 bg-gradient-to-b from-indigo-950/15 via-slate-900/5 to-white dark:to-stone-900 border border-slate-300/80 dark:border-stone-700/80 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🌑</span>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-700 dark:text-indigo-400 block">
                      Upcoming New Moon (अमावस्या)
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug">
                      {nextAmavasya.nameEn}
                    </h3>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-900 text-white shadow-xs">
                  {getCountdownBadge(nextAmavasya.date, today).text}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-stone-800/80 border border-indigo-200/60 dark:border-stone-700 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Date:</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">{nextAmavasya.formattedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Vedic Month:</span>
                  <span className="font-semibold text-indigo-700 dark:text-indigo-400">{nextAmavasya.vedicMonth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Tithi Window:</span>
                  <span className="font-mono text-[11px] text-stone-700 dark:text-stone-300 text-right">
                    {nextAmavasya.tithiWindow}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Nakshatra:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{nextAmavasya.nakshatra}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed">
                {nextAmavasya.spiritualSignificance}
              </p>

              {/* Quick Ritual & Daan */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide block">
                  Top Recommended Ritual:
                </span>
                <div className="flex items-start gap-1.5 text-stone-800 dark:text-stone-200 font-medium">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <span>{nextAmavasya.recommendedRituals[0]}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => setSelectedDay({
                  date: new Date(nextAmavasya.date),
                  dateString: nextAmavasya.date,
                  dayOfMonth: parseInt(nextAmavasya.date.split('-')[2], 10),
                  phaseType: 'new_moon',
                  phaseName: nextAmavasya.nameEn,
                  illuminationPct: 0,
                  paksha: 'Krishna Paksha',
                  approxTithi: 'Amavasya',
                  isPurnima: false,
                  isAmavasya: true,
                  isEkadashi: false,
                  event: nextAmavasya,
                })}
                className="text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Pitru Tarpan & Mantra</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSetReminder(nextAmavasya)}
                  title="Set Reminder Notification"
                  className="p-2 rounded-xl bg-indigo-100 dark:bg-stone-800 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-200 transition cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleBookTithiConsultation(nextAmavasya)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-700 to-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:from-indigo-800 hover:to-black transition cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Book Pitru Consultation</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Interactive Monthly Lunar Phase Calendar Grid */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
        {/* Calendar Header with Month Navigation and Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
                {MONTH_NAMES[currentMonthIndex]} {currentYear}
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Select any day to inspect its exact Tithi, lunar illumination, and prescribed Vedic rituals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Tabs */}
            <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                All Days
              </button>
              <button
                onClick={() => setFilterType('full_moon')}
                className={`px-3 py-1.5 font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                  filterType === 'full_moon'
                    ? 'bg-white dark:bg-stone-900 text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-amber-600'
                }`}
              >
                <span>🌕 Purnima</span>
              </button>
              <button
                onClick={() => setFilterType('new_moon')}
                className={`px-3 py-1.5 font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                  filterType === 'new_moon'
                    ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-indigo-600'
                }`}
              >
                <span>🌑 Amavasya</span>
              </button>
              <button
                onClick={() => setFilterType('vrats')}
                className={`px-3 py-1.5 font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                  filterType === 'vrats'
                    ? 'bg-white dark:bg-stone-900 text-orange-600 dark:text-orange-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-orange-600'
                }`}
              >
                <span>✨ Vrats</span>
              </button>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                title="Previous Month"
                className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleResetToCurrent}
                className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold transition cursor-pointer"
              >
                Current
              </button>

              <button
                onClick={handleNextMonth}
                title="Next Month"
                className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 7-column Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-stone-500 uppercase tracking-wider">
          {WEEKDAY_NAMES.map((name, i) => (
            <div
              key={name}
              className={`py-1.5 rounded-lg ${
                i === 0 ? 'text-rose-600 dark:text-rose-400' : ''
              }`}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((day) => {
            const isCurrentMonth = day.date.getMonth() === currentMonthIndex;
            const isToday =
              day.date.getDate() === today.getDate() &&
              day.date.getMonth() === today.getMonth() &&
              day.date.getFullYear() === today.getFullYear();

            // Filter check
            let isDimmedByFilter = false;
            if (filterType === 'full_moon' && !day.isPurnima) isDimmedByFilter = true;
            if (filterType === 'new_moon' && !day.isAmavasya) isDimmedByFilter = true;
            if (filterType === 'vrats' && !day.isPurnima && !day.isAmavasya && !day.isEkadashi) {
              isDimmedByFilter = true;
            }

            // Cell Styles
            let borderBgStyle = 'border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/60 text-stone-800 dark:text-stone-200';
            if (day.isPurnima) {
              borderBgStyle =
                'border-amber-400 dark:border-amber-500 bg-amber-500/15 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/40 font-bold shadow-xs';
            } else if (day.isAmavasya) {
              borderBgStyle =
                'border-indigo-500 dark:border-indigo-600 bg-indigo-950/25 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/40 font-bold shadow-xs';
            } else if (day.isEkadashi) {
              borderBgStyle =
                'border-orange-300 dark:border-orange-800 bg-orange-50/70 dark:bg-stone-800/80 text-orange-900 dark:text-orange-200';
            }

            if (!isCurrentMonth) {
              borderBgStyle = 'opacity-35 bg-transparent border-transparent text-stone-400';
            }

            if (isDimmedByFilter) {
              borderBgStyle += ' opacity-25';
            }

            return (
              <button
                key={day.dateString}
                onClick={() => setSelectedDay(day)}
                className={`relative min-h-[78px] sm:min-h-[96px] p-1.5 sm:p-2 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer hover:border-orange-400 hover:shadow-md ${borderBgStyle}`}
              >
                {/* Day Number & Moon Icon */}
                <div className="flex items-start justify-between gap-1">
                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      isToday
                        ? 'w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center -ml-0.5 -mt-0.5 shadow-xs'
                        : ''
                    }`}
                  >
                    {day.dayOfMonth}
                  </span>

                  <span className="text-base sm:text-lg select-none" title={day.phaseName}>
                    {day.isPurnima ? '🌕' : day.isAmavasya ? '🌑' : day.phaseType === 'waxing_crescent' ? '🌒' : day.phaseType === 'first_quarter' ? '🌓' : day.phaseType === 'waxing_gibbous' ? '🌔' : day.phaseType === 'waning_gibbous' ? '🌖' : day.phaseType === 'third_quarter' ? '🌗' : '🌘'}
                  </span>
                </div>

                {/* Tithi & Illumination Info */}
                <div className="space-y-0.5">
                  <div className="text-[10px] truncate font-medium">
                    {day.isPurnima ? (
                      <span className="text-amber-700 dark:text-amber-300 font-bold">Purnima 🌕</span>
                    ) : day.isAmavasya ? (
                      <span className="text-indigo-700 dark:text-indigo-300 font-bold">Amavasya 🌑</span>
                    ) : day.isEkadashi ? (
                      <span className="text-orange-600 dark:text-orange-400 font-bold">Ekadashi ✨</span>
                    ) : (
                      <span className="text-stone-500 dark:text-stone-400 text-[9px] sm:text-[10px]">
                        {day.approxTithi.split(' ')[1] || day.approxTithi}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-stone-400">
                    <span>{day.illuminationPct}%</span>
                    {day.event && (
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" title={day.event.nameEn} />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-amber-300/50" />
              <span>🌕 Purnima (Satyanarayan & Prosperity)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-800 ring-2 ring-indigo-400/50" />
              <span>🌑 Amavasya (Pitru Tarpana & Silence)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-400" />
              <span>✨ Sacred Vrat Days (Ekadashi)</span>
            </span>
          </div>

          <span className="text-[11px] text-stone-400 italic">
            *Drik Siddhanta Astronomical Ephemeris Standard
          </span>
        </div>
      </div>

      {/* 4. Upcoming Key Full & New Moon Dates Timeline Table */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Upcoming Purnima & Amavasya Dates (2026 - 2027)</span>
            </h3>
            <p className="text-xs text-stone-500">
              Complete chronological guide to upcoming Vedic lunar peaks with tithi windows and prescribed remedies.
            </p>
          </div>
          <span className="text-[11px] px-3 py-1 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-300 font-bold self-start sm:self-auto">
            {upcomingList.length} Upcoming Events
          </span>
        </div>

        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {upcomingList.map((event) => {
            const countdown = getCountdownBadge(event.date, today);
            const isFull = event.type === 'full_moon';

            return (
              <div
                key={event.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50/60 dark:hover:bg-stone-800/40 p-3 rounded-2xl transition"
              >
                {/* Event Name & Badges */}
                <div className="flex items-start gap-3.5 max-w-xl">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-xl shadow-xs ${
                      isFull
                        ? 'bg-amber-100 dark:bg-amber-950/60 border border-amber-300 text-amber-600'
                        : 'bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-300 text-indigo-400'
                    }`}
                  >
                    {isFull ? '🌕' : '🌑'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                        {event.nameEn}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          countdown.isToday
                            ? 'bg-emerald-500 text-white animate-pulse'
                            : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {countdown.text}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                      <span className="font-semibold text-orange-600 dark:text-orange-400">
                        {event.formattedDate}
                      </span>
                      <span>·</span>
                      <span>{event.vedicMonth}</span>
                      <span>·</span>
                      <span className="font-mono text-[11px] text-stone-600 dark:text-stone-400">
                        {event.tithiWindow}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-1">
                      {event.recommendedRituals[0]}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  <button
                    onClick={() => handleTogglePlayMantra(event)}
                    title="Audio Chanting Preview"
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                      isPlayingAudio && playingEventId === event.id
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {isPlayingAudio && playingEventId === event.id ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Mantra</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedDay({
                      date: new Date(event.date),
                      dateString: event.date,
                      dayOfMonth: parseInt(event.date.split('-')[2], 10),
                      phaseType: event.type === 'full_moon' ? 'full_moon' : event.type === 'new_moon' ? 'new_moon' : 'waxing_gibbous',
                      phaseName: event.nameEn,
                      illuminationPct: event.illuminationPct,
                      paksha: event.paksha,
                      approxTithi: event.tithi,
                      isPurnima: isFull,
                      isAmavasya: !isFull,
                      isEkadashi: false,
                      event,
                    })}
                    className="py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 transition cursor-pointer"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => handleBookTithiConsultation(event)}
                    className="py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Consult</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Deep Vedic Rituals & Consultation Significance Guide */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-orange-600" />
            <span>Why Lunar Peaks are Critical for Vedic Rituals & Consultations</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Ancient Rishi guidance on aligning sadhana, charities (daan), and astrological readings with lunar tides.
          </p>
        </div>

        {/* Guide Segmented Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {VEDIC_LUNAR_RITUAL_GUIDES.map((guide, idx) => (
            <button
              key={guide.phase}
              onClick={() => setActiveGuideIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeGuideIndex === idx
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {guide.phase}
            </button>
          ))}
        </div>

        {/* Selected Guide Content */}
        {(() => {
          const currentGuide = VEDIC_LUNAR_RITUAL_GUIDES[activeGuideIndex];
          return (
            <div className={`p-5 rounded-2xl border space-y-4 ${currentGuide.colorScheme}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 dark:border-stone-800/80 pb-3">
                <div>
                  <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">
                    {currentGuide.phase}
                  </h4>
                  <span className="text-xs font-mono text-stone-600 dark:text-stone-400">
                    {currentGuide.sanskritName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 shadow-xs text-stone-800 dark:text-stone-200">
                    {currentGuide.illumination}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                <span className="font-bold block text-stone-900 dark:text-stone-100 uppercase text-[11px] tracking-wide">
                  Cosmic & Mind Impact (चन्द्र-मन सो जाता):
                </span>
                <p>{currentGuide.whyItMatters}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                <div className="space-y-2 p-3.5 rounded-xl bg-white/70 dark:bg-stone-800/80 border border-stone-200/50 dark:border-stone-700/60">
                  <span className="font-bold text-stone-900 dark:text-stone-100 block flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Prescribed Vedic Rituals (शास्त्रोक्त अनुष्ठान)</span>
                  </span>
                  <ul className="space-y-1 text-stone-600 dark:text-stone-300 list-disc list-inside">
                    {currentGuide.keyRituals.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 p-3.5 rounded-xl bg-white/70 dark:bg-stone-800/80 border border-stone-200/50 dark:border-stone-700/60">
                  <span className="font-bold text-stone-900 dark:text-stone-100 block flex items-center gap-1.5 text-xs">
                    <PhoneCall className="w-3.5 h-3.5 text-orange-600" />
                    <span>Astrology Consultation Focus</span>
                  </span>
                  <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                    {currentGuide.consultationSignificance}
                  </p>
                  <button
                    onClick={() => {
                      if (onConsultClick) onConsultClick(currentGuide.phase);
                      else setOpenSlotBookingModal(true);
                    }}
                    className="mt-2 py-1.5 px-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition cursor-pointer"
                  >
                    <span>Consult Acharya for this Phase</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 6. Chandra Beej Mantra & Mental Tranquility Meditation Player */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-indigo-800/50 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block">
              Sacred Lunar Japa Sadhana (चन्द्र बीज मन्त्र)
            </span>
            <h4 className="text-xl sm:text-2xl font-serif font-bold">
              Chandra Mantra for Mental Serenity & Emotional Balance
            </h4>
            <p className="text-xs text-indigo-200/90 max-w-xl leading-relaxed">
              Strengthen the Moon in your birth horoscope, calm anxiety, cool pitta imbalances, and attract harmonious relationships through daily lunar japa.
            </p>
          </div>

          {/* Japa Counter Widget */}
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-indigo-700/50 text-center shrink-0 min-w-[170px] space-y-2">
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
              Japa Repetition Counter
            </span>
            <div className="text-3xl font-mono font-black text-amber-300">
              {japaCount} <span className="text-xs text-stone-400 font-normal">/ {japaTarget}</span>
            </div>

            <div className="flex items-center justify-center gap-1 text-[11px]">
              {([11, 21, 108] as const).map((tgt) => (
                <button
                  key={tgt}
                  onClick={() => setJapaTarget(tgt)}
                  className={`px-2 py-0.5 rounded text-xs transition cursor-pointer ${
                    japaTarget === tgt ? 'bg-amber-400 text-black font-bold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {tgt}x
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                onClick={handleIncrementJapa}
                className="py-1.5 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1 shadow-xs transition cursor-pointer"
              >
                <span>Chant +1</span>
              </button>
              <button
                onClick={handleResetJapa}
                className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-stone-300 transition cursor-pointer"
                title="Reset Counter"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Mantra Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 font-mono">
              ॐ सों सोमाय नमः • Om Som Somaya Namah
            </span>
            <button
              onClick={() => handleCopyMantra('chandra-beej', 'ॐ सों सोमाय नमः')}
              className="text-xs text-stone-300 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              {copiedMantraId === 'chandra-beej' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-indigo-100 font-serif text-sm">
            "दधिशङ्खतुषाराभं क्षीरोदार्णवसम्भवम्। नमामि शशिनं सोमं शम्भोर्मुकुटभूषणम्॥"
          </p>
          <p className="text-[11px] text-stone-300">
            Meaning: "I bow to the Moon God Soma, who is white like yogurt, conch shell, and snow; who emerged from the cosmic milk ocean and adorns the crest of Lord Shiva."
          </p>
        </div>
      </div>

      {/* 7. Selected Date Details Modal / Flyout */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-xl w-full p-6 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <span className="text-4xl">
                  {selectedDay.isPurnima
                    ? '🌕'
                    : selectedDay.isAmavasya
                    ? '🌑'
                    : selectedDay.phaseType === 'waxing_crescent'
                    ? '🌒'
                    : selectedDay.phaseType === 'first_quarter'
                    ? '🌓'
                    : selectedDay.phaseType === 'waxing_gibbous'
                    ? '🌔'
                    : selectedDay.phaseType === 'waning_gibbous'
                    ? '🌖'
                    : selectedDay.phaseType === 'third_quarter'
                    ? '🌗'
                    : '🌘'}
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
                    {selectedDay.event?.nameEn || selectedDay.phaseName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span>{formatDateKey(selectedDay.date)}</span>
                    <span>·</span>
                    <span className="font-semibold text-orange-600 dark:text-orange-400">
                      {selectedDay.approxTithi}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDay(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                <span className="text-stone-500 block text-[11px]">Illumination</span>
                <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {selectedDay.illuminationPct}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                <span className="text-stone-500 block text-[11px]">Vedic Paksha</span>
                <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {selectedDay.paksha}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 col-span-2 sm:col-span-1">
                <span className="text-stone-500 block text-[11px]">Phase Nature</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {selectedDay.isPurnima
                    ? 'Auspicious Purnima'
                    : selectedDay.isAmavasya
                    ? 'Introspective Amavasya'
                    : selectedDay.isEkadashi
                    ? 'Ekadashi Vrat'
                    : selectedDay.paksha === 'Shukla Paksha'
                    ? 'Waxing Growth'
                    : 'Waning Purification'}
                </span>
              </div>
            </div>

            {/* Event Specific Rituals & Details if available */}
            {selectedDay.event ? (
              <div className="space-y-4 text-xs">
                {/* Tithi Window */}
                <div className="p-3 rounded-xl bg-orange-50/60 dark:bg-stone-800/70 border border-orange-200 dark:border-stone-700 space-y-1">
                  <span className="font-bold text-orange-700 dark:text-orange-300 block">
                    Exact Tithi Auspicious Window:
                  </span>
                  <div className="font-mono text-stone-800 dark:text-stone-200">
                    {selectedDay.event.tithiWindow}
                  </div>
                  <div className="text-stone-500 text-[11px]">
                    Nakshatra: <span className="font-semibold text-stone-700 dark:text-stone-300">{selectedDay.event.nakshatra}</span> · Presiding Deity: <span className="font-semibold text-stone-700 dark:text-stone-300">{selectedDay.event.deity}</span>
                  </div>
                </div>

                {/* Significance */}
                <div className="space-y-1">
                  <span className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide text-[11px]">
                    Spiritual Significance (माहात्म्य):
                  </span>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    {selectedDay.event.spiritualSignificance}
                  </p>
                </div>

                {/* Recommended Rituals */}
                <div className="space-y-1.5">
                  <span className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide text-[11px]">
                    Prescribed Rituals:
                  </span>
                  <ul className="space-y-1 text-stone-700 dark:text-stone-300 list-disc list-inside">
                    {selectedDay.event.recommendedRituals.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                {/* Prescribed Daan */}
                <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 space-y-1">
                  <span className="font-bold text-amber-800 dark:text-amber-300 block">
                    Prescribed Daan (दान संकल्प):
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedDay.event.prescribedDaan.map((d, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-900 border border-amber-300/80 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-[11px]"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sacred Mantra */}
                <div className="p-3.5 rounded-xl bg-stone-900 text-white space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                      Sacred Tithi Mantra
                    </span>
                    <button
                      onClick={() => handleCopyMantra(selectedDay.event!.id, selectedDay.event!.mantra.sanskrit)}
                      className="text-stone-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedMantraId === selectedDay.event.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="font-serif text-amber-100 font-bold text-sm">
                    {selectedDay.event.mantra.sanskrit}
                  </div>
                  <div className="text-[11px] text-stone-300">
                    {selectedDay.event.mantra.meaning}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-stone-600 dark:text-stone-400">
                <p>
                  This date falls under <span className="font-bold text-stone-900 dark:text-stone-100">{selectedDay.paksha}</span> with approximately{' '}
                  <span className="font-bold text-orange-600 dark:text-orange-400">{selectedDay.approxTithi}</span>.
                </p>
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1">
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">
                    Daily Astro Recommendation:
                  </span>
                  <p>
                    {selectedDay.paksha === 'Shukla Paksha'
                      ? 'Favorable for creative endeavors, initiating auspicious investments, relationship harmony, and devotional singing.'
                      : 'Favorable for meditation, mental decluttering, debt repayment, and completing unfinished paperwork.'}
                  </p>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
              {selectedDay.event && (
                <button
                  onClick={() => handleSetReminder(selectedDay.event!)}
                  className="py-2.5 px-4 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Set Tithi Alert</span>
                </button>
              )}

              <button
                onClick={() => {
                  setSelectedDay(null);
                  if (onConsultClick) {
                    onConsultClick(selectedDay.event?.nameEn || selectedDay.approxTithi);
                  } else {
                    setOpenSlotBookingModal(true);
                  }
                }}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer ml-auto"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Book Astrologer Consultation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
