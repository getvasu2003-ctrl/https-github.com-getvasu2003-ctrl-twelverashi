import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { calculatePrashnaKundli } from '../../services/prashnaCalculator.ts';
import { PrashnaCalculationResult } from '../../types/astrology.ts';
import { audioSynthesis } from '../../services/audioSynthesisService.ts';
import {
  HelpCircle,
  Sparkles,
  Clock,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Share2,
  Printer,
  RotateCcw,
  Send,
  ShieldCheck,
  Award,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface PrashnaKundliSectionProps {
  onConsultClick?: () => void;
}

export const PrashnaKundliSection: React.FC<PrashnaKundliSectionProps> = ({ onConsultClick }) => {
  const { addNotification } = useApp();

  const [question, setQuestion] = useState('Will I receive a promotion and salary increment this financial quarter?');
  const [category, setCategory] = useState<'Career' | 'Marriage' | 'Finance' | 'Health' | 'Travel' | 'Lost Item' | 'General'>('Career');
  const [seedNumber, setSeedNumber] = useState<number>(() => Math.floor(1 + Math.random() * 248));
  const [locationCity, setLocationCity] = useState('Kolkata, West Bengal');
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<PrashnaCalculationResult | null>(() =>
    calculatePrashnaKundli({
      question: 'Will I receive a promotion and salary increment this financial quarter?',
      category: 'Career',
      prashnaNumber: 108,
      location: 'Kolkata, West Bengal',
    })
  );

  const handleRandomSeed = () => {
    const random = Math.floor(1 + Math.random() * 248);
    setSeedNumber(random);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsCalculating(true);
    audioSynthesis.playTempleBell(528, 1.2);

    setTimeout(() => {
      const calc = calculatePrashnaKundli({
        question: question.trim(),
        category,
        prashnaNumber: seedNumber,
        location: locationCity,
      });
      setResult(calc);
      setIsCalculating(false);
      addNotification('Prashna Kundli Cast!', `KP Horary answer computed for Seed #${seedNumber}.`, 'muhurat');
    }, 400);
  };

  const handleShareWhatsApp = () => {
    if (!result) return;
    const text =
      `🧭 *12Rashi Official Prashna Kundli (Horary Astrology) Verdict* 🧭\n\n` +
      `Question: *"${result.question}"*\n` +
      `KP Seed Number: *#${result.prashnaNumber}* (Out of 249)\n` +
      `Verdict: *${result.verdict}* (${result.confidencePercentage}% Confidence)\n` +
      `Expected Timing: *${result.timeframeForecast}*\n` +
      `Prashna Lagna: ${result.prashnaLagna} (Lord: ${result.prashnaLagnaLord})\n` +
      `Remedy: ${result.prescribedRemedy}\n\n` +
      `Calculated via Chitrapaksha Ephemeris: https://12rashi.com\n` +
      `Astrology Helpline: +91 9831039814`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-amber-200 text-xs font-bold border border-amber-300/30">
            <Compass className="w-3.5 h-3.5" />
            <span>Classical Krishnamurti Paddhati (KP) & Parashari Horary Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight">
            Prashna Kundli (प्रश्न कुण्डली)
          </h1>

          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed max-w-2xl">
            <strong>Don't have your exact birth time or hospital records?</strong> In Vedic Jyotish, the exact moment a sincere question arises in the mind carries the identical cosmic Prana as a birth chart. Pick a sacred seed number between 1 and 249 to unlock instant binary answers, event timing, and remedies.
          </p>

          <div className="flex items-center gap-3 pt-2 text-xs text-amber-200">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Zero Birth-Time Dependency • Microsecond Ephemeris Calculation</span>
          </div>
        </div>
      </div>

      {/* Query Formulation Form */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
        <form onSubmit={handleCalculate} className="space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block font-bold text-stone-900 dark:text-stone-100 mb-1.5 uppercase tracking-wide text-[11px]">
              Domain of Inquiry (प्रश्न क्षेत्र)
            </label>
            <div className="flex flex-wrap gap-2">
              {(['Career', 'Marriage', 'Finance', 'Health', 'Travel', 'Lost Item', 'General'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    category === cat
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Question Textarea */}
          <div>
            <label className="block font-bold text-stone-900 dark:text-stone-100 mb-1.5 uppercase tracking-wide text-[11px]">
              Your Specific Question (स्पष्ट प्रश्न लिखें)
            </label>
            <textarea
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              placeholder="e.g. Will I get the promotion this month? Will our marriage happen with family consent? Will my lost gold ornament be found?"
              className="w-full p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm font-serif outline-hidden focus:ring-2 focus:ring-orange-500 border border-stone-200 dark:border-stone-700 resize-none"
            />
          </div>

          {/* Sacred KP Seed Number (1 to 249) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-200 dark:border-stone-700 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                  Prashna Seed Number (1 to 249)
                </label>
                <button
                  type="button"
                  onClick={handleRandomSeed}
                  className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Random Seed</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={249}
                  value={seedNumber}
                  onChange={(e) => setSeedNumber(parseInt(e.target.value) || 1)}
                  className="w-24 p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-300 dark:border-stone-600 text-base font-bold font-mono text-center outline-hidden"
                />
                <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
                  Think of your Ishta Devata / Universal Prana and choose any integer from <strong>1 to 249</strong>.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2">
              <label className="font-bold text-stone-900 dark:text-stone-100 text-xs block">
                Your Current Physical Location
              </label>
              <input
                type="text"
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                placeholder="e.g. Kolkata, West Bengal"
                className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-semibold outline-hidden"
              />
              <span className="text-[10px] text-stone-400 block">
                Accurate local coordinates anchor the Horary Lagna calculation.
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isCalculating || !question.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-md transition transform hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>{isCalculating ? 'Casting Horary Ephemeris...' : 'Cast Prashna Kundli & Reveal Verdict'}</span>
          </button>
        </form>
      </div>

      {/* Prashna Analysis Verdict & Horoscope Display */}
      {result && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-md space-y-6 animate-fade-in">
          {/* Verdict Banner */}
          <div
            className={`p-6 rounded-3xl border-2 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              result.verdict.includes('Favorable')
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                : result.verdict.includes('Delayed')
                ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
                : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
            }`}
          >
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest block opacity-75">
                KP Horary Final Verdict
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black flex items-center gap-2">
                {result.verdict.includes('Favorable') ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                ) : result.verdict.includes('Delayed') ? (
                  <Clock className="w-7 h-7 text-amber-600" />
                ) : (
                  <AlertTriangle className="w-7 h-7 text-rose-600" />
                )}
                <span>{result.verdict}</span>
              </h2>
              <p className="text-xs sm:text-sm font-medium opacity-90 max-w-xl">
                Expected Timing: <strong>{result.timeframeForecast}</strong> • Confidence: <strong>{result.confidencePercentage}%</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleShareWhatsApp}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share (WhatsApp)</span>
              </button>

              <button
                onClick={() => window.print()}
                className="py-2.5 px-4 rounded-xl bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Ephemeris & Horary Coordinates */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <span className="text-[10px] text-stone-400 block font-bold uppercase">Prashna Lagna</span>
              <strong className="text-sm text-stone-900 dark:text-stone-100 block mt-0.5">
                {result.prashnaLagna}
              </strong>
              <span className="text-[10px] text-orange-600 font-semibold">Lord: {result.prashnaLagnaLord}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <span className="text-[10px] text-stone-400 block font-bold uppercase">Query Moon Sign</span>
              <strong className="text-sm text-stone-900 dark:text-stone-100 block mt-0.5">
                {result.moonSign}
              </strong>
              <span className="text-[10px] text-stone-500 font-semibold">Nakshatra: {result.moonNakshatra}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <span className="text-[10px] text-stone-400 block font-bold uppercase">Significator (Karyesh)</span>
              <strong className="text-sm text-stone-900 dark:text-stone-100 block mt-0.5">
                {result.karyeshPlanet}
              </strong>
              <span className="text-[10px] text-stone-500 font-semibold">House #{result.karyeshHouse}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <span className="text-[10px] text-stone-400 block font-bold uppercase">Query Timestamp</span>
              <strong className="text-sm text-stone-900 dark:text-stone-100 block mt-0.5">
                {result.queryTime}
              </strong>
              <span className="text-[10px] text-stone-500 font-semibold">{result.location.split(',')[0]}</span>
            </div>
          </div>

          {/* Detailed Astrological Synthesis */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-3 font-serif">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-orange-600" />
              <span>Deep Horary Analysis (फलकथन एवं ग्रह समन्वय)</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              {result.detailedAnalysis}
            </p>
          </div>

          {/* Action & Scriptural Remedy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-200 dark:border-stone-700 space-y-1.5">
              <span className="font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wide text-[10px] block">
                Prescribed Vedic Remedy (दोष शमन उपाय)
              </span>
              <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                {result.prescribedRemedy}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-stone-800/60 border border-blue-200 dark:border-stone-700 space-y-1.5">
              <span className="font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wide text-[10px] block">
                Action Recommendation (व्यावहारिक दिशा)
              </span>
              <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                {result.suggestedAction}
              </p>
            </div>
          </div>

          {/* Astrologer Consultation CTA */}
          {onConsultClick && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="space-y-0.5">
                <strong className="text-sm font-bold block">
                  Need an Acharya to examine subtle sub-period transits for this question?
                </strong>
                <p className="text-xs text-amber-100">
                  Connect live with verified Parashari & KP Prashna astrologers.
                </p>
              </div>

              <button
                onClick={onConsultClick}
                className="py-2.5 px-5 rounded-xl bg-white text-orange-950 font-extrabold text-xs shadow-md hover:bg-amber-100 transition cursor-pointer shrink-0"
              >
                Consult Live Astrologer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
