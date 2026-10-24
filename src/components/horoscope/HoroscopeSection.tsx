import React, { useState } from 'react';
import { RASHIS_DATA } from '../../data/horoscopeData.ts';
import { useApp } from '../../context/AppContext.tsx';
import {
  Sparkles,
  Share2,
  Calendar,
  Briefcase,
  Heart,
  Activity,
  Compass,
  Check,
  Headphones,
  Radio,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { RashiInfo } from '../../types/astrology.ts';

interface HoroscopeSectionProps {
  onOpenAudioBroadcast?: () => void;
}

export const HoroscopeSection: React.FC<HoroscopeSectionProps> = ({ onOpenAudioBroadcast }) => {
  const { pushPermission, requestPushPermission, sendDailyHoroscopePush } = useApp();
  const [selectedRashi, setSelectedRashi] = useState<RashiInfo>(RASHIS_DATA[0]);
  const [timeframe, setTimeframe] = useState<'today' | 'weekly' | 'monthly'>('today');
  const [copied, setCopied] = useState(false);
  const [isPushed, setIsPushed] = useState(false);

  const handleShare = () => {
    const text = `🌟 12Rashi Daily Horoscope for ${selectedRashi.nameEn} (${selectedRashi.nameSa}) 🌟\n\n"${selectedRashi.today.summary}"\n\n💼 Career: ${selectedRashi.today.career}\n❤️ Love: ${selectedRashi.today.love}\n🍀 Lucky Number: ${selectedRashi.today.luckyNumber} | Lucky Color: ${selectedRashi.today.luckyColor}\n\nRead more on 12Rashi: https://12rashi.com\nHelpline: +91 9831039814`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSendNativePush = async () => {
    if (pushPermission !== 'granted') {
      await requestPushPermission();
    }
    const success = await sendDailyHoroscopePush(selectedRashi.nameEn);
    if (success) {
      setIsPushed(true);
      setTimeout(() => setIsPushed(false), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-amber-200 text-xs font-bold mb-2 border border-amber-300/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily Planetary Transits & Rashi Phal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight">
            12 Rashis Horoscope & Predictions
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            Discover how cosmic alignments, Moon transits, and planetary movements shape your day, week, and month.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-2.5">
            {onOpenAudioBroadcast && (
              <button
                onClick={onOpenAudioBroadcast}
                className="py-2.5 px-4 rounded-2xl bg-white text-orange-950 font-extrabold text-xs shadow-md hover:bg-amber-100 transition transform hover:scale-102 flex items-center gap-2 cursor-pointer"
              >
                <Headphones className="w-4 h-4 text-orange-600" />
                <span>Audio Rashi Fal (ऑडियो)</span>
              </button>
            )}

            <button
              onClick={handleSendNativePush}
              className="py-2.5 px-4 rounded-2xl bg-black/35 hover:bg-black/50 text-white font-bold text-xs border border-white/20 transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              {isPushed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Push Delivered to Device!</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>Send Today's Horoscope Push Alert</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 12 Zodiac Sign Selection Wheel / Grid */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
        <h3 className="text-xs uppercase tracking-wider font-bold text-stone-500 mb-3">
          Select Your Zodiac Sign (Rashi)
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {RASHIS_DATA.map((rashi) => {
            const isSelected = selectedRashi.id === rashi.id;
            return (
              <button
                key={rashi.id}
                onClick={() => setSelectedRashi(rashi)}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-b from-orange-500 to-red-600 text-white border-orange-600 shadow-md transform scale-105'
                    : 'bg-stone-50 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700/60 hover:bg-amber-50 dark:hover:bg-stone-800'
                }`}
              >
                <span className="text-xl sm:text-2xl leading-none mb-1">{rashi.symbol}</span>
                <span className="text-xs font-bold tracking-tight">{rashi.nameEn}</span>
                <span className={`text-[10px] ${isSelected ? 'text-amber-200' : 'text-stone-400'}`}>
                  {rashi.nameHi}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Rashi Forecast Card */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
        {/* Rashi Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center text-3xl font-bold shadow-md">
              {selectedRashi.symbol}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  {selectedRashi.nameEn} ({selectedRashi.nameSa} / {selectedRashi.nameHi})
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 font-semibold">
                  {selectedRashi.element} Element
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {selectedRashi.dates} • Ruling Planet: <strong className="text-orange-600">{selectedRashi.rulingPlanet}</strong>
              </p>
            </div>
          </div>

          {/* Timeframe selector & Share button */}
          <div className="flex items-center gap-2">
            <div className="bg-stone-100 dark:bg-stone-800 p-1 rounded-xl flex items-center gap-1">
              {(['today', 'weekly', 'monthly'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                    timeframe === t
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition shadow-xs flex items-center gap-1 text-xs font-bold"
              title="Share to WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Prediction Content */}
        {timeframe === 'today' ? (
          <div className="space-y-5">
            {/* Today Summary */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-stone-800 dark:text-stone-200 text-xs sm:text-sm leading-relaxed">
              <span className="font-bold text-orange-600 dark:text-orange-400 block mb-1 uppercase tracking-wider text-[11px]">
                Today’s Astrological Overview
              </span>
              {selectedRashi.today.summary}
            </div>

            {/* Detailed Career, Love, Health Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-wide">
                  <Briefcase className="w-4 h-4" />
                  <span>Career & Business</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {selectedRashi.today.career}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wide">
                  <Heart className="w-4 h-4" />
                  <span>Love & Relationships</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {selectedRashi.today.love}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wide">
                  <Activity className="w-4 h-4" />
                  <span>Health & Vitality</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {selectedRashi.today.health}
                </p>
              </div>
            </div>

            {/* Lucky Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 text-center">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Lucky Number</span>
                <div className="text-base font-bold text-orange-600 mt-0.5">{selectedRashi.today.luckyNumber}</div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 text-center">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Lucky Color</span>
                <div className="text-xs font-bold text-red-600 mt-0.5 truncate">{selectedRashi.today.luckyColor}</div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 text-center">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Auspicious Time</span>
                <div className="text-xs font-bold text-amber-600 mt-0.5">{selectedRashi.today.luckyTime}</div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 text-center">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Favorable Direction</span>
                <div className="text-xs font-bold text-emerald-600 mt-0.5">{selectedRashi.today.auspiciousDirection}</div>
              </div>
            </div>
          </div>
        ) : timeframe === 'weekly' ? (
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-300 space-y-2">
            <h4 className="font-bold text-orange-600 uppercase tracking-wide text-xs">
              Weekly Transit Analysis
            </h4>
            <p>{selectedRashi.weekly}</p>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-300 space-y-2">
            <h4 className="font-bold text-orange-600 uppercase tracking-wide text-xs">
              Monthly Astrological Outlook
            </h4>
            <p>{selectedRashi.monthly}</p>
          </div>
        )}
      </div>
    </div>
  );
};
