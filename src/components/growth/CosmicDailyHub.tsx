import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { audioSynthesis } from '../../services/audioSynthesisService.ts';
import {
  Compass,
  Clock,
  Flame,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Phone,
  MessageSquare,
  Star,
  ShieldCheck,
  Award,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import type { Astrologer } from '../../types/astrology.ts';

interface HoraInfo {
  planet: string;
  sanskrit: string;
  quality: 'Shubh' | 'Labh' | 'Moderate' | 'Caution';
  bestFor: string;
  avoid: string;
  color: string;
}

// Classical Vedic Chaldean Hora sequence
const HORA_SEQUENCE: HoraInfo[] = [
  {
    planet: 'Sun (Surya)',
    sanskrit: 'सूर्य होरा',
    quality: 'Shubh',
    bestFor: 'Government work, leadership pitches, authority meetings & starting bold initiatives',
    avoid: 'Ego clashes or heated personal arguments',
    color: 'Deep Saffron',
  },
  {
    planet: 'Venus (Shukra)',
    sanskrit: 'शुक्र होरा',
    quality: 'Labh',
    bestFor: 'Love conversations, marriage talks, creative arts, luxury purchases & diplomacy',
    avoid: 'Over-indulgence or impulsive spending',
    color: 'Ivory White',
  },
  {
    planet: 'Mercury (Budh)',
    sanskrit: 'बुध होरा',
    quality: 'Labh',
    bestFor: 'Signing contracts, interviews, trading, writing, study & business negotiations',
    avoid: 'Signing paperwork without reading fine print',
    color: 'Emerald Green',
  },
  {
    planet: 'Moon (Chandra)',
    sanskrit: 'चन्द्र होरा',
    quality: 'Shubh',
    bestFor: 'Family bonding, travel, hospitality, intuitive planning & healing conversations',
    avoid: 'Making decisions while emotionally restless',
    color: 'Pearl Silver',
  },
  {
    planet: 'Saturn (Shani)',
    sanskrit: 'शनि होरा',
    quality: 'Caution',
    bestFor: 'Deep disciplined focus, clearing pending tasks, real estate audits & legal review',
    avoid: 'Rushed launches, speculative bets or short-cuts',
    color: 'Royal Indigo',
  },
  {
    planet: 'Jupiter (Guru)',
    sanskrit: 'गुरु होरा',
    quality: 'Shubh',
    bestFor: 'Financial investments, auspicious ceremonies, mentorship, career growth & vows',
    avoid: 'Over-promising beyond capacity',
    color: 'Turmeric Gold',
  },
  {
    planet: 'Mars (Mangal)',
    sanskrit: 'मंगल होरा',
    quality: 'Moderate',
    bestFor: 'High-energy execution, athletics, technical debugging & courageous action',
    avoid: 'Hasty emotional confrontations or road impatience',
    color: 'Coral Red',
  },
];

// Weekday ruler start index in HORA_SEQUENCE (0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat)
const DAY_START_HORA_INDEX = [0, 3, 6, 2, 5, 1, 4];

const RAHU_KAAL_BY_DAY: Record<number, string> = {
  0: '04:30 PM – 06:00 PM',
  1: '07:30 AM – 09:00 AM',
  2: '03:00 PM – 04:30 PM',
  3: '12:00 PM – 01:30 PM',
  4: '01:30 PM – 03:00 PM',
  5: '10:30 AM – 12:00 PM',
  6: '09:00 AM – 10:30 AM',
};

const RASHI_LIST = [
  { id: 'Mesha', label: 'Mesha', english: 'Aries', lord: 'Mars', mantraDevanagari: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः', mantraLatin: 'Om Kram Kreem Kraum Sah Bhaumaya Namah', deity: 'Lord Hanuman' },
  { id: 'Vrishabha', label: 'Vrishabha', english: 'Taurus', lord: 'Venus', mantraDevanagari: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः', mantraLatin: 'Om Dram Dreem Draum Sah Shukraya Namah', deity: 'Maa Lakshmi' },
  { id: 'Mithuna', label: 'Mithuna', english: 'Gemini', lord: 'Mercury', mantraDevanagari: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः', mantraLatin: 'Om Bram Breem Braum Sah Budhaya Namah', deity: 'Lord Vishnu' },
  { id: 'Karka', label: 'Karka', english: 'Cancer', lord: 'Moon', mantraDevanagari: 'ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः', mantraLatin: 'Om Shram Shreem Shraum Sah Chandramase Namah', deity: 'Lord Shiva' },
  { id: 'Simha', label: 'Simha', english: 'Leo', lord: 'Sun', mantraDevanagari: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः', mantraLatin: 'Om Hram Hreem Hraum Sah Suryaya Namah', deity: 'Lord Surya' },
  { id: 'Kanya', label: 'Kanya', english: 'Virgo', lord: 'Mercury', mantraDevanagari: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः', mantraLatin: 'Om Bram Breem Braum Sah Budhaya Namah', deity: 'Lord Ganesha' },
  { id: 'Tula', label: 'Tula', english: 'Libra', lord: 'Venus', mantraDevanagari: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः', mantraLatin: 'Om Dram Dreem Draum Sah Shukraya Namah', deity: 'Maa Durga' },
  { id: 'Vrishchika', label: 'Vrishchika', english: 'Scorpio', lord: 'Mars', mantraDevanagari: 'ॐ नमः शिवाय', mantraLatin: 'Om Namah Shivaya', deity: 'Lord Kartikeya' },
  { id: 'Dhanu', label: 'Dhanu', english: 'Sagittarius', lord: 'Jupiter', mantraDevanagari: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः', mantraLatin: 'Om Gram Greem Graum Sah Gurave Namah', deity: 'Lord Brihaspati' },
  { id: 'Makara', label: 'Makara', english: 'Capricorn', lord: 'Saturn', mantraDevanagari: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः', mantraLatin: 'Om Pram Preem Praum Sah Shanaishcharaya Namah', deity: 'Lord Shani Dev' },
  { id: 'Kumbha', label: 'Kumbha', english: 'Aquarius', lord: 'Saturn', mantraDevanagari: 'ॐ महामृत्युंजयाय नमः', mantraLatin: 'Om Tryambakam Yajamahe', deity: 'Lord Shiva' },
  { id: 'Meena', label: 'Meena', english: 'Pisces', lord: 'Jupiter', mantraDevanagari: 'ॐ नमो भगवते वासुदेवाय', mantraLatin: 'Om Namo Bhagavate Vasudevaya', deity: 'Lord Narayana' },
];

interface SankalpState {
  streakDays: number;
  lastCompletedDate: string;
  karmaCoins: number;
  totalBeads: number;
  roundsCompletedToday: number;
}

const DEFAULT_SANKALP: SankalpState = {
  streakDays: 0,
  lastCompletedDate: '',
  karmaCoins: 0,
  totalBeads: 0,
  roundsCompletedToday: 0,
};

function getIstNow(): Date {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs + 5.5 * 3600 * 1000);
}

function getTodayKey(ist: Date): string {
  return `${ist.getFullYear()}-${String(ist.getMonth() + 1).padStart(2, '0')}-${String(ist.getDate()).padStart(2, '0')}`;
}

function getYesterdayKey(ist: Date): string {
  const y = new Date(ist.getTime() - 24 * 3600 * 1000);
  return getTodayKey(y);
}

interface CosmicDailyHubProps {
  onNavigate?: (tab: string) => void;
}

export const CosmicDailyHub: React.FC<CosmicDailyHubProps> = ({ onNavigate }) => {
  const {
    user,
    userProfile,
    isUserLoggedIn,
    setOpenLoginModal,
    astrologers,
    startConsultation,
    addNotification,
  } = useApp();

  const [activePanel, setActivePanel] = useState<'hora' | 'japa' | 'matchmaker'>('hora');
  const [istNow, setIstNow] = useState<Date>(() => getIstNow());

  // Derive default Rashi from logged-in user's permanent Kundli or profile
  const initialRashiId = useMemo(() => {
    const raw = (user?.kundliSummary?.moonSign || user?.rashi || userProfile.rashi || 'Mesha').toLowerCase();
    const match = RASHI_LIST.find(
      (r) => raw.includes(r.id.toLowerCase()) || raw.includes(r.english.toLowerCase())
    );
    return match ? match.id : 'Mesha';
  }, [user?.kundliSummary?.moonSign, user?.rashi, userProfile.rashi]);

  const [selectedRashiId, setSelectedRashiId] = useState<string>(initialRashiId);

  useEffect(() => {
    setSelectedRashiId(initialRashiId);
  }, [initialRashiId]);

  // Live 1-second IST clock tick for active Hora countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setIstNow(getIstNow());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Digital Japa Mala & Sankalp Streak state
  const [malaTarget, setMalaTarget] = useState<11 | 27 | 54 | 108>(11);
  const [beadCount, setBeadCount] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [sankalp, setSankalp] = useState<SankalpState>(() => {
    try {
      const saved = localStorage.getItem('12rashi_sankalp_streak');
      if (saved) return { ...DEFAULT_SANKALP, ...JSON.parse(saved) };
    } catch {
      // ignore storage errors
    }
    return DEFAULT_SANKALP;
  });

  // 10-Second Smart Acharya Matchmaker state
  const [matchGoal, setMatchGoal] = useState<string>('Career & Wealth');
  const [matchLang, setMatchLang] = useState<string>('Any');

  const selectedRashi = useMemo(
    () => RASHI_LIST.find((r) => r.id === selectedRashiId) || RASHI_LIST[0],
    [selectedRashiId]
  );

  // Compute exact current & next Vedic Planetary Hora from IST sunrise (6:00 AM)
  const horaState = useMemo(() => {
    const dayOfWeek = istNow.getDay();
    const hour = istNow.getHours();
    const minute = istNow.getMinutes();
    const second = istNow.getSeconds();

    // Vedic day runs 6:00 AM -> next day 6:00 AM
    const vedicDayIndex = hour < 6 ? (dayOfWeek + 6) % 7 : dayOfWeek;
    const hoursSinceSunrise = (hour - 6 + 24) % 24;
    const startIdx = DAY_START_HORA_INDEX[vedicDayIndex];
    const currentHoraIdx = (startIdx + hoursSinceSunrise) % 7;
    const nextHoraIdx = (currentHoraIdx + 1) % 7;

    const remainingSecs = (59 - minute) * 60 + (60 - second);
    const remM = Math.floor(remainingSecs / 60);
    const remS = remainingSecs % 60;

    return {
      current: HORA_SEQUENCE[currentHoraIdx],
      next: HORA_SEQUENCE[nextHoraIdx],
      countdown: `${String(remM).padStart(2, '0')}:${String(remS).padStart(2, '0')}`,
      rahuKaal: RAHU_KAAL_BY_DAY[dayOfWeek],
      istTimeLabel: istNow.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
  }, [istNow]);

  // Deterministic Vedic Chandrabala daily energy scores for chosen Rashi + date
  const dailyEnergy = useMemo(() => {
    const rashiIdx = RASHI_LIST.findIndex((r) => r.id === selectedRashiId);
    const daySeed = istNow.getFullYear() * 366 + (istNow.getMonth() + 1) * 31 + istNow.getDate();
    const calc = (offset: number) => 68 + ((daySeed * 7 + (rashiIdx + 1) * 13 + offset * 17) % 29);

    return {
      career: calc(1),
      love: calc(2),
      wealth: calc(3),
      vitality: calc(4),
      luckyNum: ((daySeed + rashiIdx) % 9) + 1,
    };
  }, [selectedRashiId, istNow]);

  // Persist Sankalp updates
  const saveSankalp = (next: SankalpState) => {
    setSankalp(next);
    try {
      localStorage.setItem('12rashi_sankalp_streak', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleChantBead = () => {
    const nextBead = beadCount + 1;
    if (soundEnabled) {
      audioSynthesis.playTempleBell(nextBead >= malaTarget ? 880 : 659, nextBead >= malaTarget ? 0.9 : 0.22);
    }

    if (nextBead >= malaTarget) {
      const todayKey = getTodayKey(istNow);
      const yesterdayKey = getYesterdayKey(istNow);
      const isNewDay = sankalp.lastCompletedDate !== todayKey;
      const continuesStreak = sankalp.lastCompletedDate === yesterdayKey;

      const nextStreak = isNewDay
        ? continuesStreak
          ? sankalp.streakDays + 1
          : 1
        : Math.max(1, sankalp.streakDays);

      const bonusCoins = malaTarget === 108 ? 40 : malaTarget === 54 ? 25 : 15;
      const updated: SankalpState = {
        streakDays: nextStreak,
        lastCompletedDate: todayKey,
        karmaCoins: sankalp.karmaCoins + bonusCoins,
        totalBeads: sankalp.totalBeads + 1,
        roundsCompletedToday: isNewDay ? 1 : sankalp.roundsCompletedToday + 1,
      };
      saveSankalp(updated);
      setBeadCount(0);

      addNotification(
        'Sankalp Mala Complete',
        `Completed ${malaTarget} beads for ${selectedRashi.label} Rashi! +${bonusCoins} Karma Coins earned (Day ${nextStreak} Streak).`,
        'muhurat'
      );
    } else {
      setBeadCount(nextBead);
      saveSankalp({
        ...sankalp,
        totalBeads: sankalp.totalBeads + 1,
      });
    }
  };

  // Top 3 matched online astrologers for the 10-second Matchmaker
  const matchedExperts = useMemo<Astrologer[]>(() => {
    return astrologers
      .filter((a) => {
        if (matchGoal === 'Instant 24/7 AI') {
          if (!a.isAi) return false;
        } else {
          const goalKeyword = matchGoal.split(' ')[0].toLowerCase();
          const hasSpec = a.specialties.some((s) => s.toLowerCase().includes(goalKeyword));
          if (!hasSpec) return false;
        }
        if (matchLang !== 'Any' && !a.languages.includes(matchLang)) return false;
        return a.status === 'online';
      })
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, [astrologers, matchGoal, matchLang]);

  const malaPercent = Math.min(100, Math.round((beadCount / malaTarget) * 100));
  const ringCircumference = 2 * Math.PI * 52;
  const ringDashOffset = ringCircumference * (1 - beadCount / malaTarget);

  const handleQuickConsult = (astro: Astrologer, mode: 'chat' | 'audio') => {
    if (!isUserLoggedIn) {
      setOpenLoginModal(true);
      return;
    }
    startConsultation(astro, mode);
  };

  return (
    <section
      aria-label="Daily Cosmic Compass and Personal Sankalp Hub"
      className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden"
    >
      {/* Top Header + Segmented Mode Switcher */}
      <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-medium">
            <span className="text-orange-600 dark:text-orange-400 font-semibold">12Rashi Exclusive</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">IST {horaState.istTimeLabel}</span>
            {sankalp.streakDays > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold tabular-nums">
                  {sankalp.streakDays}-Day Sankalp Streak ({sankalp.karmaCoins} Karma)
                </span>
              </>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-0.5 tracking-tight">
            {isUserLoggedIn && user?.name && user.name !== 'Astro Seeker'
              ? `${user.name.split(' ')[0]}'s Live Cosmic Compass & Daily Sadhana`
              : 'Your Live Vedic Hora, Digital Japa Mala & 10s Acharya Match'}
          </h2>
        </div>

        {/* Interactive Segmented Tab Bar */}
        <div
          role="tablist"
          aria-label="Cosmic Daily Hub tools"
          className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl overflow-x-auto no-scrollbar shrink-0"
        >
          <button
            role="tab"
            type="button"
            aria-selected={activePanel === 'hora'}
            onClick={() => setActivePanel('hora')}
            className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activePanel === 'hora'
                ? 'bg-white dark:bg-stone-900 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Live Hora Compass</span>
          </button>

          <button
            role="tab"
            type="button"
            aria-selected={activePanel === 'japa'}
            onClick={() => setActivePanel('japa')}
            className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activePanel === 'japa'
                ? 'bg-white dark:bg-stone-900 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>108-Bead Japa Mala</span>
          </button>

          <button
            role="tab"
            type="button"
            aria-selected={activePanel === 'matchmaker'}
            onClick={() => setActivePanel('matchmaker')}
            className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activePanel === 'matchmaker'
                ? 'bg-white dark:bg-stone-900 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>10s Acharya Match</span>
          </button>
        </div>
      </div>

      {/* PANEL 1: LIVE PLANETARY HORA & PERSONAL ENERGY */}
      {activePanel === 'hora' && (
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Live Planetary Hora Window */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-stone-500 dark:text-stone-400">
                  Active Planetary Hora · {horaState.current.sanskrit}
                </span>
                <span
                  className={`font-bold ${
                    horaState.current.quality === 'Caution'
                      ? 'text-amber-700 dark:text-amber-400'
                      : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {horaState.current.quality} Window
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-2xl font-serif font-black text-stone-900 dark:text-white tracking-tight">
                  {horaState.current.planet}
                </h3>
                <div className="text-right shrink-0">
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 block">Next Hora in</span>
                  <span className="font-mono text-lg font-bold text-orange-600 dark:text-orange-400 tabular-nums">
                    {horaState.countdown}
                  </span>
                </div>
              </div>

              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                <strong className="text-stone-900 dark:text-stone-100">Best right now:</strong> {horaState.current.bestFor}.
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                <strong>Avoid:</strong> {horaState.current.avoid} · <strong>Up next:</strong> {horaState.next.planet}
              </p>
            </div>

            {/* Key Daily Muhurat Strip */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-stone-500 dark:text-stone-400 block">Abhijit Muhurat</span>
                <strong className="text-emerald-700 dark:text-emerald-400 font-semibold tabular-nums mt-0.5 block">
                  11:48 AM – 12:36 PM
                </strong>
              </div>
              <div>
                <span className="text-stone-500 dark:text-stone-400 block">Today&apos;s Rahu Kaal</span>
                <strong className="text-rose-700 dark:text-rose-400 font-semibold tabular-nums mt-0.5 block">
                  {horaState.rahuKaal}
                </strong>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-stone-500 dark:text-stone-400 block">Hora Power Color</span>
                <strong className="text-stone-900 dark:text-stone-100 font-semibold mt-0.5 block">
                  {horaState.current.color}
                </strong>
              </div>
            </div>
          </div>

          {/* Right: Personalized 4-Pillar Rashi Energy + Quick Action */}
          <div className="lg:col-span-6 lg:border-l lg:border-stone-100 lg:dark:border-stone-800 lg:pl-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  Today&apos;s Chandrabala Energy · {selectedRashi.label} ({selectedRashi.english})
                </span>
                <select
                  aria-label="Select your Moon Sign Rashi"
                  value={selectedRashiId}
                  onChange={(e) => setSelectedRashiId(e.target.value)}
                  className="text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 outline-none cursor-pointer"
                >
                  {RASHI_LIST.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label} ({r.english})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Career', score: dailyEnergy.career },
                  { label: 'Love', score: dailyEnergy.love },
                  { label: 'Wealth', score: dailyEnergy.wealth },
                  { label: 'Vitality', score: dailyEnergy.vitality },
                ].map((metric) => (
                  <div key={metric.label} className="space-y-1.5">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-stone-600 dark:text-stone-400">{metric.label}</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                        {metric.score}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-xs text-stone-600 dark:text-stone-400">
                <span>Ruling Planet: <strong className="text-stone-900 dark:text-stone-100">{selectedRashi.lord}</strong></span>
                <span aria-hidden="true"> · </span>
                <span>Lucky No: <strong className="text-stone-900 dark:text-stone-100 tabular-nums">{dailyEnergy.luckyNum}</strong></span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActivePanel('japa')}
                  className="flex-1 sm:flex-initial min-h-[40px] px-3.5 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 text-orange-700 dark:text-orange-300 text-xs font-bold transition cursor-pointer whitespace-nowrap"
                >
                  Chant Today&apos;s Mantra
                </button>
                <button
                  type="button"
                  onClick={() => (isUserLoggedIn ? onNavigate?.('kundli') : setOpenLoginModal(true))}
                  className="flex-1 sm:flex-initial min-h-[40px] px-3.5 py-2 rounded-xl bg-stone-900 dark:bg-orange-600 hover:bg-stone-800 dark:hover:bg-orange-500 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
                >
                  <span>{isUserLoggedIn ? 'Full Kundli' : 'Sign Up Free'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PANEL 2: INTERACTIVE 108-BEAD DIGITAL RUDRAKSHA JAPA MALA & DAILY STREAK */}
      {activePanel === 'japa' && (
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Interactive Circular Rudraksha Bead Counter */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center space-y-3">
            <button
              type="button"
              onClick={handleChantBead}
              aria-label={`Tap to count bead ${beadCount + 1} of ${malaTarget}`}
              className="relative w-36 h-36 rounded-full flex items-center justify-center group focus-visible:outline-2 focus-visible:outline-orange-500 cursor-pointer active:scale-95 transition-transform"
            >
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  strokeWidth="8"
                  fill="none"
                  className="stroke-stone-200 dark:stroke-stone-800"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringDashOffset}
                  className="stroke-orange-600 dark:stroke-orange-500 transition-all duration-200"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-mono tabular-nums text-stone-900 dark:text-white">
                  {beadCount}
                </span>
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 tabular-nums">
                  of {malaTarget} beads
                </span>
                <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 mt-0.5">
                  Tap to Chant
                </span>
              </div>
            </button>

            <div className="flex items-center gap-2">
              {([11, 27, 54, 108] as const).map((target) => (
                <button
                  key={target}
                  type="button"
                  onClick={() => {
                    setMalaTarget(target);
                    setBeadCount(0);
                  }}
                  className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-bold tabular-nums transition cursor-pointer ${
                    malaTarget === target
                      ? 'bg-orange-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  {target}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSoundEnabled((s) => !s)}
                aria-label={soundEnabled ? 'Mute temple chime' : 'Enable temple chime'}
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-orange-600 cursor-pointer"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setBeadCount(0)}
                aria-label="Reset current mala count"
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-orange-600 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Personalized Mantra + Daily Sankalp Streak */}
          <div className="lg:col-span-7 space-y-4 lg:border-l lg:border-stone-100 lg:dark:border-stone-800 lg:pl-6">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400">
                <span>
                  Personalized Beej Mantra · {selectedRashi.label} ({selectedRashi.deity})
                </span>
                <span className="tabular-nums font-semibold text-orange-600 dark:text-orange-400">
                  {malaPercent}% Complete
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-white leading-snug">
                {selectedRashi.mantraDevanagari}
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-400 italic">
                {selectedRashi.mantraLatin}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
              <div>
                <span className="text-stone-500 dark:text-stone-400 block">Daily Streak</span>
                <strong className="text-base font-bold text-stone-900 dark:text-white tabular-nums">
                  {sankalp.streakDays} {sankalp.streakDays === 1 ? 'Day' : 'Days'}
                </strong>
              </div>
              <div>
                <span className="text-stone-500 dark:text-stone-400 block">Karma Coins</span>
                <strong className="text-base font-bold text-orange-600 dark:text-orange-400 tabular-nums">
                  {sankalp.karmaCoins}
                </strong>
              </div>
              <div>
                <span className="text-stone-500 dark:text-stone-400 block">Lifetime Beads</span>
                <strong className="text-base font-bold text-stone-900 dark:text-white tabular-nums">
                  {sankalp.totalBeads}
                </strong>
              </div>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Complete one daily Mala round to keep your Sankalp Streak alive and earn Karma Coins toward priority remedies and live temple Puja Sankalpas.
            </p>
          </div>
        </div>
      )}

      {/* PANEL 3: 10-SECOND SMART ACHARYA MATCHMAKER + WHY 12RASHI WINS */}
      {activePanel === 'matchmaker' && (
        <div className="p-4 sm:p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                'Career & Wealth',
                'Love & Relationship',
                'Marriage & Manglik',
                'Shani & Sade Sati',
                'Instant 24/7 AI',
              ].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setMatchGoal(goal)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    matchGoal === goal
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-700'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>

            <select
              aria-label="Preferred consultation language"
              value={matchLang}
              onChange={(e) => setMatchLang(e.target.value)}
              className="min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 outline-none cursor-pointer shrink-0"
            >
              {['Any', 'Hindi', 'English', 'Bengali', 'Tamil', 'Marathi', 'Gujarati'].map((lang) => (
                <option key={lang} value={lang}>
                  {lang === 'Any' ? 'Any Language' : lang}
                </option>
              ))}
            </select>
          </div>

          {/* Top 3 Best-Matched Online Experts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {matchedExperts.length > 0 ? (
              matchedExperts.map((astro) => (
                <div
                  key={astro.id}
                  className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/70 flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold text-sm flex items-center justify-center shrink-0 overflow-hidden">
                      {astro.avatar ? (
                        <img
                          src={astro.avatar}
                          alt={astro.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        astro.name.charAt(0)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-stone-900 dark:text-white truncate">
                        {astro.name}
                      </h4>
                      <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mt-0.5">
                        <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-bold tabular-nums">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {astro.rating.toFixed(1)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{astro.experienceYears} yrs</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-stone-700 dark:text-stone-200 tabular-nums">
                          ₹{astro.chatRate}/min
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate mt-1">
                        {astro.languages.slice(0, 3).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickConsult(astro, 'chat')}
                      className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat Now</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickConsult(astro, 'audio')}
                      className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Call</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="md:col-span-3 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 text-xs text-stone-600 dark:text-stone-400 text-center">
                No online specialist matches that exact language filter right now — switch language to <strong>Any Language</strong> for instant connections.
              </div>
            )}
          </div>

          {/* Transparent Competitive Advantage Row */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 dark:text-stone-100 block">Per-Second Fair Billing</strong>
                <span className="text-stone-500 dark:text-stone-400">Never pay for rounded full minutes</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 dark:text-stone-100 block">1st-Min Auto Refund</strong>
                <span className="text-stone-500 dark:text-stone-400">Zero risk if disconnected under 60s</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 dark:text-stone-100 block">10 Free Family Charts</strong>
                <span className="text-stone-500 dark:text-stone-400">Cloud-synced Kundli Vault forever</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <UserCheck className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 dark:text-stone-100 block">Unknown Birth Time?</strong>
                <span className="text-stone-500 dark:text-stone-400">Instant KP Prashna Horary engine</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
