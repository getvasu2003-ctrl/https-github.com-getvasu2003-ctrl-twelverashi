import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  generateNumerologyReport,
  evaluatePhoneOrVehicleNumber,
  NumerologyReport,
} from '../../services/numerologyService.ts';
import {
  Sparkles,
  Hash,
  Compass,
  Phone,
  Car,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Star,
  Download,
  PhoneCall,
  User,
  Calendar,
  Layers,
  Zap,
  Info,
  ShieldCheck,
} from 'lucide-react';

interface NumerologyPageProps {
  onConsultClick?: () => void;
}

export const NumerologyPage: React.FC<NumerologyPageProps> = ({ onConsultClick }) => {
  const { activeFamilyProfile, user } = useApp();

  const [name, setName] = useState(activeFamilyProfile?.name || user?.name || 'Vasudev Sharma');
  const [dob, setDob] = useState(activeFamilyProfile?.dob || user?.dob || '1992-08-15');
  const [report, setReport] = useState<NumerologyReport | null>(null);
  const [loading, setLoading] = useState(false);

  // Phone / Vehicle Tool State
  const [testNumber, setTestNumber] = useState(user?.phone || '9831049814');
  const [testResult, setTestResult] = useState<any>(null);

  // Compute on mount or button click
  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim() || !dob) return;

    setLoading(true);
    try {
      // Call backend API or local service
      const res = await fetch('/api/numerology/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), dob }),
      });
      const data = await res.json();
      if (data.success && data.report) {
        setReport(data.report);
      } else {
        setReport(generateNumerologyReport(name.trim(), dob));
      }
    } catch {
      setReport(generateNumerologyReport(name.trim(), dob));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCalculate();
  }, []);

  const handleTestNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!report || !testNumber) return;
    const res = evaluatePhoneOrVehicleNumber(testNumber, report.mulank);
    setTestResult(res);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-stone-800 dark:text-stone-200">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950 via-stone-900 to-orange-950 border border-amber-500/30 p-6 md:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Hash className="w-3.5 h-3.5" />
            <span>Vedic & Chaldean Numerology API Engine (अंक ज्योतिष)</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight">
            Sacred Numerology & Lo Shu Grid
          </h1>

          <p className="text-sm text-stone-300 leading-relaxed">
            Discover your <strong>Mulank (Driver)</strong>, <strong>Bhagyank (Conductor)</strong>, and <strong>Namank (Chaldean Name Vibration)</strong>. Decode cosmic karmic patterns, 3x3 Lo Shu planes, lucky gems, and vehicle/mobile number harmony.
          </p>
        </div>
      </div>

      {/* Input Calculator Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-orange-200 dark:border-stone-800 shadow-lg">
        <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-orange-500" />
              <span>Full Name (for Chaldean Vibration)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vasudev Sharma"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-orange-500" />
              <span>Date of Birth</span>
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-md transition cursor-pointer text-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{loading ? 'Calculating...' : 'Calculate Numerology'}</span>
            </button>
          </div>
        </form>

        {/* Quick Family Member Chips */}
        {activeFamilyProfile && (
          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 text-xs">
            <span className="text-stone-400">Quick load from Active Family Chart:</span>
            <button
              type="button"
              onClick={() => {
                setName(activeFamilyProfile.name);
                setDob(activeFamilyProfile.dob);
              }}
              className="px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 font-bold hover:bg-orange-200 cursor-pointer"
            >
              {activeFamilyProfile.name} ({activeFamilyProfile.relation})
            </button>
          </div>
        )}
      </div>

      {/* Main Results View */}
      {report && (
        <div className="space-y-8 animate-fade-in">
          {/* Top 3 Core Numbers Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Mulank (Driver) */}
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent rounded-3xl p-6 border-2 border-amber-500/30 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  मूलांक (Driver / Root)
                </span>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                  Day Number
                </h3>
                <p className="text-xs text-stone-500">
                  Defines your core soul nature, ego & innate gifts
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-3xl font-extrabold shadow-md shrink-0">
                {report.mulank}
              </div>
            </div>

            {/* Bhagyank (Conductor) */}
            <div className="bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent rounded-3xl p-6 border-2 border-orange-500/30 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 block">
                  भाग्यांक (Conductor / Destiny)
                </span>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                  Life Path Number
                </h3>
                <p className="text-xs text-stone-500">
                  Defines karmic destiny, major career and life mission
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-md shrink-0">
                {report.bhagyank}
              </div>
            </div>

            {/* Namank (Chaldean Name Number) */}
            <div className="bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-transparent rounded-3xl p-6 border-2 border-rose-500/30 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                  नामांक (Chaldean Name)
                </span>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                  Compound {report.compoundNameNumber} ➔ {report.namank}
                </h3>
                <p className="text-xs text-stone-500">
                  Chaldean vibration governing public aura and social luck
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center text-3xl font-extrabold shadow-md shrink-0">
                {report.namank}
              </div>
            </div>
          </div>

          {/* Ruling Planet & Traits Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Planet Details */}
            <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-orange-200 dark:border-stone-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">
                    Ruling Celestial Body
                  </span>
                  <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-white mt-0.5">
                    {report.rulingPlanet.nameEn} • {report.rulingPlanet.nameHi}
                  </h2>
                </div>
                <div className="text-right text-xs">
                  <span className="text-stone-400 block">Presiding Deity:</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">{report.rulingPlanet.deity}</span>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
                  <span className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 uppercase text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Signature Superpowers
                  </span>
                  <ul className="space-y-1 text-stone-700 dark:text-stone-300">
                    {report.traits.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 space-y-2">
                  <span className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5 uppercase text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Karmic Blindspots
                  </span>
                  <ul className="space-y-1 text-stone-700 dark:text-stone-300">
                    {report.traits.weaknesses.map((w, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Careers */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-stone-700 dark:text-stone-300 block">
                  High-Success Career Alignments:
                </span>
                <div className="flex flex-wrap gap-2">
                  {report.traits.careerMatches.map((c, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold text-[11px] border border-stone-200 dark:border-stone-700"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Spiritual Lesson */}
              <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-xs text-orange-950 dark:text-orange-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Core Spiritual Directive:</strong>
                  <p className="mt-0.5 text-stone-600 dark:text-stone-400">{report.traits.spiritualLesson}</p>
                </div>
              </div>
            </div>

            {/* Right Col: Lucky Auspicious Attributes */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-orange-200 dark:border-stone-800 shadow-sm space-y-4 text-xs">
              <h3 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span>Lucky Auspicious Coordinates</span>
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-1.5 border-b border-stone-100 dark:border-stone-800">
                  <span className="text-stone-500">Lucky Colors:</span>
                  <span className="font-bold text-stone-900 dark:text-white">{report.luckyAttributes.colors.join(', ')}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-stone-100 dark:border-stone-800">
                  <span className="text-stone-500">Lucky Gemstones:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{report.luckyAttributes.gemstones.join(', ')}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-stone-100 dark:border-stone-800">
                  <span className="text-stone-500">Auspicious Days:</span>
                  <span className="font-bold text-stone-900 dark:text-white">{report.luckyAttributes.days.join(', ')}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-stone-100 dark:border-stone-800">
                  <span className="text-stone-500">Favorable Dates:</span>
                  <span className="font-bold text-stone-900 dark:text-white">{report.luckyAttributes.dates.join(', ')}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-stone-100 dark:border-stone-800">
                  <span className="text-stone-500">Lucky Direction:</span>
                  <span className="font-bold text-stone-900 dark:text-white">{report.luckyAttributes.favorableDirections.join(', ')}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-stone-100 dark:border-stone-800">
                  <span className="text-emerald-600 font-bold">Friendly Numbers:</span>
                  <span className="font-bold text-emerald-600">{report.luckyAttributes.friendlyNumbers.join(', ')}</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-rose-600 font-bold">Enemy Numbers (Avoid):</span>
                  <span className="font-bold text-rose-600">{report.luckyAttributes.enemyNumbers.join(', ')}</span>
                </div>
              </div>

              {/* Personal Year Card */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-stone-800 dark:text-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">
                  Personal Year {report.personalYear.year} (Cycle #{report.personalYear.number})
                </span>
                <strong className="block text-sm text-stone-900 dark:text-white">{report.personalYear.theme}</strong>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-tight">
                  {report.personalYear.guidance}
                </p>
              </div>
            </div>
          </div>

          {/* Lo Shu Grid 3x3 Interactive Matrix */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 md:p-8 border border-orange-200 dark:border-stone-800 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">
                  3x3 Vedic Matrix
                </span>
                <h3 className="text-xl font-bold font-serif text-stone-900 dark:text-white">
                  Lo Shu Grid (लो शू चक्र) Analysis
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Derived from your Date of Birth ({dob}), Mulank ({report.mulank}), and Bhagyank ({report.bhagyank})
                </p>
              </div>

              {/* Raj Yoga Badges */}
              <div className="flex items-center gap-2 text-xs">
                {report.loShuGrid.planes.goldenRajYoga && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Golden Raj Yoga (4-5-6)
                  </span>
                )}
                {report.loShuGrid.planes.silverRajYoga && (
                  <span className="px-3 py-1 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-stone-400" />
                    Silver Raj Yoga (2-5-8)
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* 3x3 Grid Graphic */}
              <div className="flex justify-center">
                <div className="grid grid-cols-3 gap-2.5 p-4 bg-stone-100 dark:bg-stone-800 rounded-3xl border border-orange-200 dark:border-stone-700 w-full max-w-xs shadow-inner">
                  {/* Row 1: 4, 9, 2 (Mental Plane) */}
                  {[4, 9, 2, 3, 5, 7, 8, 1, 6].map((num) => {
                    const count = report.loShuGrid.grid[num] || 0;
                    const isPresent = count > 0;

                    return (
                      <div
                        key={num}
                        className={`h-20 rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all ${
                          isPresent
                            ? 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-extrabold shadow-md transform scale-100'
                            : 'bg-white/60 dark:bg-stone-900/60 text-stone-300 dark:text-stone-600 border border-dashed border-stone-300 dark:border-stone-700 font-normal'
                        }`}
                      >
                        <span className="text-2xl font-serif">{isPresent ? num : '-'}</span>
                        <span className="text-[10px] tracking-tight">
                          {isPresent ? `${count}x` : `Missing ${num}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lo Shu Planes Breakdown */}
              <div className="space-y-3 text-xs">
                <span className="font-bold text-stone-700 dark:text-stone-300 block">
                  Cosmic Energy Planes:
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className={`p-2.5 rounded-xl border ${report.loShuGrid.planes.mental ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' : 'border-stone-200 dark:border-stone-800'}`}>
                    <span className="font-bold block">Mental Plane (4-9-2)</span>
                    <span className="text-[11px] text-stone-500">{report.loShuGrid.planes.mental ? '100% Active (Sharp intellect)' : 'Partially Active'}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${report.loShuGrid.planes.emotional ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' : 'border-stone-200 dark:border-stone-800'}`}>
                    <span className="font-bold block">Emotional Plane (3-5-7)</span>
                    <span className="text-[11px] text-stone-500">{report.loShuGrid.planes.emotional ? '100% Active (High empathy)' : 'Partially Active'}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${report.loShuGrid.planes.practical ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' : 'border-stone-200 dark:border-stone-800'}`}>
                    <span className="font-bold block">Practical Plane (8-1-6)</span>
                    <span className="text-[11px] text-stone-500">{report.loShuGrid.planes.practical ? '100% Active (Grounding & wealth)' : 'Partially Active'}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${report.loShuGrid.planes.will ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' : 'border-stone-200 dark:border-stone-800'}`}>
                    <span className="font-bold block">Willpower Plane (9-5-1)</span>
                    <span className="text-[11px] text-stone-500">{report.loShuGrid.planes.will ? '100% Active (Unyielding drive)' : 'Partially Active'}</span>
                  </div>
                </div>

                {/* Missing Numbers Remedies */}
                {report.loShuGrid.missingNumbers.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <span className="font-bold text-amber-700 dark:text-amber-400 block">
                      Vedic Remedies for Missing Numbers:
                    </span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {report.loShuGrid.remediesForMissing.map((rem) => (
                        <div key={rem.num} className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 text-[11px] flex justify-between gap-2">
                          <div>
                            <strong className="text-amber-900 dark:text-amber-200">Missing {rem.num}:</strong>{' '}
                            <span>{rem.remedy}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 shrink-0">
                            Gem: {rem.crystal}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Name Harmony & Phone / Vehicle Tool Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Name Harmony */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-orange-200 dark:border-stone-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-orange-100 dark:bg-stone-800 text-orange-600">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-stone-900 dark:text-white">
                    Chaldean Name Correction Analysis
                  </h3>
                  <p className="text-xs text-stone-500">
                    Vedic spelling vibration harmony with your Mulank {report.mulank}
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                report.nameHarmonious
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {report.nameHarmonious ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Harmonious Name Vibration</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Opportunity for Name Enhancement</span>
                    </>
                  )}
                </div>
                <p className="leading-relaxed">{report.nameHarmonyMessage}</p>
              </div>

              <p className="text-[11px] text-stone-400">
                In Indian astrology, famous leaders, entrepreneurs, and artists strategically adjust their name spelling (e.g. Ayushmann Khurrana, Suniel Shetty) to resonate with compound number 1, 3, 5, or 6.
              </p>
            </div>

            {/* Phone & Vehicle Number Compatibility Tool */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-orange-200 dark:border-stone-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-orange-100 dark:bg-stone-800 text-orange-600">
                  <Phone className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-stone-900 dark:text-white">
                    Phone & Vehicle Plate Vibrations
                  </h3>
                  <p className="text-xs text-stone-500">
                    Test if your mobile digits or car plate number support your growth
                  </p>
                </div>
              </div>

              <form onSubmit={handleTestNumber} className="flex gap-2">
                <input
                  type="text"
                  value={testNumber}
                  onChange={(e) => setTestNumber(e.target.value)}
                  placeholder="e.g. 9831049814 or MH 02 AB 1234"
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="py-2 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm"
                >
                  Analyze
                </button>
              </form>

              {testResult && (
                <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                  testResult.isFavorable
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-900 dark:text-emerald-200'
                    : 'bg-stone-50 dark:bg-stone-800 border-stone-200 text-stone-800 dark:text-stone-200'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total Sum: {testResult.sum} ➔ Single Digit: {testResult.singleDigit}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white dark:bg-stone-900 shadow-xs">
                      {testResult.rulingPlanet}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{testResult.verdict}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
