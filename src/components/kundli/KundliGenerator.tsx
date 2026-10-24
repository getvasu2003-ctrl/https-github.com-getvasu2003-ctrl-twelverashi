import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { calculateKundli } from '../../services/kundliCalculator.ts';
import {
  Compass,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Share2,
  BookmarkCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Download,
  Printer,
  Copy,
  Check,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { KundliData } from '../../types/astrology.ts';
import { useTranslation } from '../../i18n/useTranslation.ts';
import { PrashnaKundliSection } from './PrashnaKundliSection.tsx';

interface KundliGeneratorProps {
  onOpenReports?: () => void;
  onOpenPrashna?: () => void;
}

export const KundliGenerator: React.FC<KundliGeneratorProps> = ({ onOpenReports, onOpenPrashna }) => {
  const { t } = useTranslation();
  const {
    currentKundli,
    setCurrentKundli,
    saveKundli,
    userProfile,
    addNotification,
    setOpenKundliPdfModal,
    openDoshaBooking,
  } = useApp();

  // Form states
  const [name, setName] = useState(userProfile.name);
  const [gender, setGender] = useState(userProfile.gender);
  const [dob, setDob] = useState(userProfile.dob);
  const [tob, setTob] = useState(userProfile.tob);
  const [pob, setPob] = useState(userProfile.pob);

  const [chartType, setChartType] = useState<'north' | 'south'>('north');
  const [activeTab, setActiveTab] = useState<'chart' | 'planets' | 'houses' | 'doshas' | 'dasha'>('chart');
  const [viewMode, setViewMode] = useState<'janam' | 'prashna'>('janam');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const popularCities = [
    'Kolkata, West Bengal',
    'Delhi, NCR',
    'Mumbai, Maharashtra',
    'Varanasi, Uttar Pradesh',
    'Bengaluru, Karnataka',
    'Jaipur, Rajasthan',
    'Chennai, Tamil Nadu',
    'Patna, Bihar',
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const newK = calculateKundli(name, gender, dob, tob, pob);
    setCurrentKundli(newK);
    addNotification('Kundli Calculated', `Vedic natal chart generated for ${name}.`, 'transit');
  };

  const handleSave = () => {
    if (currentKundli) {
      saveKundli(currentKundli);
    }
  };

  const handleWhatsAppShare = () => {
    if (!currentKundli) return;
    const shareText = `🌟 My Vedic Kundli on 12Rashi 🌟\nName: ${currentKundli.name}\nAscendant (Lagna): ${currentKundli.ascendant}\nMoon Sign (Rashi): ${currentKundli.moonSign}\nNakshatra: ${currentKundli.nakshatra} (Lord: ${currentKundli.nakshatraLord})\nCurrent Mahadasha: ${currentKundli.vimshottariDasha.mahadasha}\nCheck your free birth chart on 12Rashi: https://12rashi.com\nAstrology Helpline: +91 9831039814`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(`https://12rashi.com/kundli?name=${encodeURIComponent(currentKundli?.name || '')}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-amber-200 text-xs font-bold mb-2 border border-amber-300/30">
            <Compass className="w-3.5 h-3.5" />
            <span>Accurate Vedic Parashari Ephemeris Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight">
            {t('kundli_title')}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            {t('kundli_subtitle')}
          </p>
        </div>
      </div>

      {/* Dual Mode Switcher: Janam Kundli vs Prashna Kundli (Unknown Birth Time) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('janam')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              viewMode === 'janam'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <span>📜 Janam Kundli (Birth Chart)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('prashna')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              viewMode === 'prashna'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <span>🧭 Prashna Kundli (Horary)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-stone-950 font-extrabold uppercase">
              No Birth Time Needed
            </span>
          </button>
        </div>

        {onOpenReports && (
          <button
            type="button"
            onClick={onOpenReports}
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline px-3 py-1.5 flex items-center gap-1 cursor-pointer"
          >
            <span>Brihat 50+ Pg PDF (₹499)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {viewMode === 'prashna' ? (
        <PrashnaKundliSection onConsultClick={onOpenPrashna} />
      ) : (
        <>
          {/* Input Form & Kundli Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Birth Details */}
        <div className="lg:col-span-4 bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <h2 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <span>Enter Birth Details</span>
            </h2>
            <span className="text-[11px] text-orange-600 font-semibold">100% Free</span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs outline-hidden focus:ring-2 focus:ring-orange-500"
                placeholder="Seeker's Name"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs outline-hidden"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                Time of Birth (24hr or AM/PM)
              </label>
              <input
                type="time"
                value={tob}
                onChange={(e) => setTob(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs outline-hidden"
              />
              <div className="mt-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-tight">
                  <span className="font-bold text-stone-800 dark:text-stone-200">Don't know exact birth time?</span>
                  <p className="text-stone-600 dark:text-stone-400 mt-0.5">
                    No hospital records? Use Prashna Kundli (Horary) to get precise answers without birth time.
                  </p>
                  <button
                    type="button"
                    onClick={() => setViewMode('prashna')}
                    className="mt-1 inline-flex items-center gap-0.5 font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                  >
                    <span>Switch to Prashna Kundli</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                Place of Birth
              </label>
              <input
                type="text"
                value={pob}
                onChange={(e) => setPob(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs outline-hidden"
                placeholder="e.g. Kolkata, West Bengal"
              />
              {/* Quick city suggestions */}
              <div className="mt-1.5 flex flex-wrap gap-1">
                {popularCities.slice(0, 4).map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setPob(city)}
                    className="text-[10px] px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-orange-600 cursor-pointer"
                  >
                    {city.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md transition transform hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('kundli_btn_calc')}</span>
            </button>
          </form>
        </div>

        {/* Right Output: Interactive Chart & Analysis */}
        <div className="lg:col-span-8 space-y-4">
          {currentKundli ? (
            <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
              {/* Output Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                    Kundli for {currentKundli.name}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {currentKundli.dob} • {currentKundli.tob} • {currentKundli.pob}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setOpenKundliPdfModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer transition transform hover:scale-105"
                    title="Generate and print authentic multi-page Vedic Kundli PDF report"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{t('kundli_download_pdf')}</span>
                  </button>

                  {onOpenReports && (
                    <button
                      onClick={onOpenReports}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-extrabold flex items-center gap-1 shadow-md cursor-pointer transition transform hover:scale-105 animate-pulse"
                      title="Get complete 50+ page lifetime prediction dossier with 120-year Vimshottari Mahadasha"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      <span>Brihat 50+ Pg PDF (₹499)</span>
                    </button>
                  )}

                  <button
                    onClick={handleSave}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-1 cursor-pointer"
                  >
                    <BookmarkCheck className="w-3.5 h-3.5 text-orange-600" />
                    <span>{t('kundli_save_profile')}</span>
                  </button>

                  <button
                    onClick={() => setShowShareModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{t('kundli_share')}</span>
                  </button>
                </div>
              </div>

              {/* Vital Astrological Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-orange-50 dark:bg-stone-800/80 border border-orange-200/60 dark:border-stone-700 text-center">
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Lagna (Ascendant)</span>
                  <div className="font-bold text-sm text-orange-700 dark:text-orange-400 mt-0.5">{currentKundli.ascendant}</div>
                  <span className="text-[10px] text-stone-400">Lord: {currentKundli.ascendantLord}</span>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-stone-800/80 border border-amber-200/60 dark:border-stone-700 text-center">
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Moon Sign (Rashi)</span>
                  <div className="font-bold text-sm text-amber-700 dark:text-amber-400 mt-0.5">{currentKundli.moonSign}</div>
                  <span className="text-[10px] text-stone-400">Chandra</span>
                </div>

                <div className="p-3 rounded-2xl bg-red-50 dark:bg-stone-800/80 border border-red-200/60 dark:border-stone-700 text-center">
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Nakshatra</span>
                  <div className="font-bold text-sm text-red-700 dark:text-red-400 mt-0.5">{currentKundli.nakshatra}</div>
                  <span className="text-[10px] text-stone-400">Lord: {currentKundli.nakshatraLord}</span>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50 dark:bg-stone-800/80 border border-purple-200/60 dark:border-stone-700 text-center">
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Active Mahadasha</span>
                  <div className="font-bold text-sm text-purple-700 dark:text-purple-400 mt-0.5">{currentKundli.vimshottariDasha.mahadasha}</div>
                  <span className="text-[10px] text-stone-400">Till {currentKundli.vimshottariDasha.endsOn}</span>
                </div>
              </div>

              {/* Sub-tabs: Chart View, Planets, Houses, Doshas */}
              <div className="flex items-center gap-1 border-b border-stone-100 dark:border-stone-800 pb-2 overflow-x-auto no-scrollbar">
                {(['chart', 'planets', 'houses', 'doshas', 'dasha'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition cursor-pointer ${
                      activeTab === tab
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {tab === 'chart' ? 'Birth Chart (Kundli)' : tab}
                  </button>
                ))}
              </div>

              {/* Tab 1: Chart View (North Indian Diamond Chart SVG) */}
              {activeTab === 'chart' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-600 dark:text-stone-300">
                      Chart Style:
                    </span>
                    <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
                      <button
                        onClick={() => setChartType('north')}
                        className={`px-2.5 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                          chartType === 'north' ? 'bg-orange-600 text-white' : 'text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        North Indian (Diamond)
                      </button>
                      <button
                        onClick={() => setChartType('south')}
                        className={`px-2.5 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                          chartType === 'south' ? 'bg-orange-600 text-white' : 'text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        South Indian (Square)
                      </button>
                    </div>
                  </div>

                  {/* SVG Kundli Diamond Chart */}
                  <div className="flex justify-center p-4 bg-amber-50/50 dark:bg-stone-950/60 rounded-2xl border border-amber-200/50 dark:border-stone-800">
                    <svg viewBox="0 0 400 400" className="w-full max-w-sm drop-shadow-md">
                      {/* Outer boundary square */}
                      <rect x="10" y="10" width="380" height="380" fill="none" stroke="#D97706" strokeWidth="2.5" />
                      {/* Main Diamond Cross Lines */}
                      <line x1="10" y1="10" x2="390" y2="390" stroke="#D97706" strokeWidth="1.5" />
                      <line x1="390" y1="10" x2="10" y2="390" stroke="#D97706" strokeWidth="1.5" />
                      <line x1="200" y1="10" x2="390" y2="200" stroke="#D97706" strokeWidth="1.5" />
                      <line x1="390" y1="200" x2="200" y2="390" stroke="#D97706" strokeWidth="1.5" />
                      <line x1="200" y1="390" x2="10" y2="200" stroke="#D97706" strokeWidth="1.5" />
                      <line x1="10" y1="200" x2="200" y2="10" stroke="#D97706" strokeWidth="1.5" />

                      {/* 1st House (Lagna - Top Diamond Center) */}
                      <text x="200" y="80" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#DC2626">
                        1 (Lagna)
                      </text>
                      <text x="200" y="100" textAnchor="middle" fontSize="10" fill="#B45309">
                        {currentKundli.ascendant.split(' ')[0]}
                      </text>
                      <text x="200" y="125" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#15803D">
                        {currentKundli.houses[0].planets.join(', ') || '—'}
                      </text>

                      {/* 4th House (Right Diamond Center) */}
                      <text x="90" y="200" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#DC2626">4</text>
                      <text x="90" y="220" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#15803D">
                        {currentKundli.houses[3].planets.join(', ') || '—'}
                      </text>

                      {/* 7th House (Bottom Diamond Center) */}
                      <text x="200" y="320" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#DC2626">7</text>
                      <text x="200" y="340" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#15803D">
                        {currentKundli.houses[6].planets.join(', ') || '—'}
                      </text>

                      {/* 10th House (Left Diamond Center) */}
                      <text x="310" y="200" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#DC2626">10</text>
                      <text x="310" y="220" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#15803D">
                        {currentKundli.houses[9].planets.join(', ') || '—'}
                      </text>

                      {/* House 2, 3, 5, 6, 8, 9, 11, 12 numbers and labels */}
                      <text x="120" y="60" fontSize="10" fill="#78350F">2: {currentKundli.houses[1].planets.join(', ') || '—'}</text>
                      <text x="60" y="120" fontSize="10" fill="#78350F">3: {currentKundli.houses[2].planets.join(', ') || '—'}</text>
                      <text x="60" y="280" fontSize="10" fill="#78350F">5: {currentKundli.houses[4].planets.join(', ') || '—'}</text>
                      <text x="120" y="350" fontSize="10" fill="#78350F">6: {currentKundli.houses[5].planets.join(', ') || '—'}</text>
                      <text x="280" y="350" fontSize="10" fill="#78350F">8: {currentKundli.houses[7].planets.join(', ') || '—'}</text>
                      <text x="340" y="280" fontSize="10" fill="#78350F">9: {currentKundli.houses[8].planets.join(', ') || '—'}</text>
                      <text x="340" y="120" fontSize="10" fill="#78350F">11: {currentKundli.houses[10].planets.join(', ') || '—'}</text>
                      <text x="280" y="60" fontSize="10" fill="#78350F">12: {currentKundli.houses[11].planets.join(', ') || '—'}</text>
                    </svg>
                  </div>
                </div>
              )}

              {/* Tab 2: Planetary Positions Table */}
              {activeTab === 'planets' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-b border-stone-200 dark:border-stone-700">
                        <th className="p-2.5">Graha (Planet)</th>
                        <th className="p-2.5">Rashi (Sign)</th>
                        <th className="p-2.5">Degree</th>
                        <th className="p-2.5">House</th>
                        <th className="p-2.5">Nakshatra (Pada)</th>
                        <th className="p-2.5">Dignity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                      {currentKundli.planets.map((p) => (
                        <tr key={p.planet} className="hover:bg-amber-50/50 dark:hover:bg-stone-800/40">
                          <td className="p-2.5 font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1">
                            <span>{p.planet} ({p.sanskritName})</span>
                            {p.isRetrograde && (
                              <span className="text-[9px] px-1 bg-red-100 dark:bg-red-950 text-red-600 rounded">R</span>
                            )}
                          </td>
                          <td className="p-2.5">{p.sign}</td>
                          <td className="p-2.5 font-mono">{p.degree}</td>
                          <td className="p-2.5 font-bold text-orange-600">{p.house}</td>
                          <td className="p-2.5">{p.nakshatra} (P{p.pada})</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.dignity === 'Exalted' ? 'bg-emerald-100 text-emerald-800' :
                              p.dignity === 'Own Sign' ? 'bg-amber-100 text-amber-800' :
                              p.dignity === 'Debilitated' ? 'bg-red-100 text-red-800' :
                              'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                            }`}>
                              {p.dignity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 3: 12 Houses */}
              {activeTab === 'houses' && (
                <div className="space-y-2 text-xs">
                  {currentKundli.houses.map((h) => (
                    <div
                      key={h.houseNumber}
                      className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-orange-600 text-white text-[11px]">
                            House #{h.houseNumber}
                          </span>
                          <span>{h.sign} (Lord: {h.signLord})</span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                          {h.significance}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase text-stone-400 font-semibold">Occupying Planets:</span>
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">
                          {h.planets.length > 0 ? h.planets.join(', ') : 'Empty (No Planet)'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Dosha Analysis */}
              {activeTab === 'doshas' && (
                <div className="space-y-3 text-xs">
                  {/* Manglik */}
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-600" />
                        <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                          Manglik Dosha (Kuja Dosha)
                        </h4>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        currentKundli.doshas.manglik.hasDosha
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {currentKundli.doshas.manglik.hasDosha ? `Active (${currentKundli.doshas.manglik.severity})` : 'No Dosha'}
                      </span>
                    </div>
                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                      {currentKundli.doshas.manglik.details}
                    </p>
                    <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-stone-700 dark:text-stone-200">
                      <strong>Prescribed Vedic Remedy:</strong> {currentKundli.doshas.manglik.remedy}
                    </div>

                    {/* Contextual 1-Tap Booking Button */}
                    <div className="mt-3 flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-stone-200 dark:border-stone-700">
                      <span className="text-[11px] text-stone-500 font-semibold">
                        Garbhagriha Mangal Shanti Invocation:
                      </span>
                      <button
                        onClick={() =>
                          openDoshaBooking({
                            doshaType: 'manglik',
                            title: 'Manglik Dosha Shanti & Hanuman Sankalp',
                            hindiTitle: 'अयोध्या हनुमानगढ़ी मांगलिक दोष शांति महा संकल्प',
                            suggestedTemple: 'Hanumangarhi Dham, Ayodhya',
                            location: 'Ayodhya Dham, UP',
                            deity: 'Lord Hanuman & Bhagavan Sri Ram',
                            suggestedDakshina: 351,
                            priestName: 'Mahant Ramdas Ji (Hanumangarhi)',
                            remedyDescription:
                              'Recitation of personal Name & Gotra in front of the holy Gada of Lord Hanuman to dissolve marital friction, aggressive Mars vibrations, and relationship delays.',
                            seekerName: currentKundli.name,
                            rashi: currentKundli.moonSign,
                            nakshatra: currentKundli.nakshatra,
                          })
                        }
                        className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition transform hover:scale-105"
                      >
                        <Flame className="w-3.5 h-3.5 text-amber-200" />
                        <span>Book Hanumangarhi E-Sankalpa (₹351)</span>
                      </button>
                    </div>
                  </div>

                  {/* Kaal Sarp */}
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                        Kaal Sarp Yoga
                      </h4>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        currentKundli.doshas.kaalSarp.hasDosha
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {currentKundli.doshas.kaalSarp.type}
                      </span>
                    </div>
                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                      {currentKundli.doshas.kaalSarp.details}
                    </p>
                    <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-stone-700 dark:text-stone-200">
                      <strong>Prescribed Vedic Remedy:</strong> {currentKundli.doshas.kaalSarp.remedy}
                    </div>

                    {/* Contextual 1-Tap Booking Button */}
                    <div className="mt-3 flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-stone-200 dark:border-stone-700">
                      <span className="text-[11px] text-stone-500 font-semibold">
                        Ujjain Jyotirlinga Mahakal Parihara:
                      </span>
                      <button
                        onClick={() =>
                          openDoshaBooking({
                            doshaType: 'kaal_sarp',
                            title: 'Mahakaleshwar Kaal Sarp & Navagraha Shanti',
                            hindiTitle: 'उज्जैन महाकालेश्वर कालसर्प दोष शांति हवन संकल्प',
                            suggestedTemple: 'Shri Mahakaleshwar Jyotirlinga',
                            location: 'Ujjain, Madhya Pradesh',
                            deity: 'Lord Mahakal & Navagrahas',
                            suggestedDakshina: 751,
                            priestName: 'Pt. Rameshwar Trivedi (Ujjain Peeth)',
                            remedyDescription:
                              'Rahu-Ketu dosha shanti ahuti at the sacred Kunda in Ujjain. Name and gotra chanted by temple priests during the auspicious Brahma Muhurat.',
                            seekerName: currentKundli.name,
                            rashi: currentKundli.moonSign,
                            nakshatra: currentKundli.nakshatra,
                          })
                        }
                        className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition transform hover:scale-105"
                      >
                        <Flame className="w-3.5 h-3.5 text-amber-200" />
                        <span>Book Mahakal Kaal Sarp Sankalp (₹751)</span>
                      </button>
                    </div>
                  </div>

                  {/* Sade Sati */}
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                        Shani Sade Sati Transit
                      </h4>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        currentKundli.doshas.sadeSati.isActive
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {currentKundli.doshas.sadeSati.phase}
                      </span>
                    </div>
                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                      {currentKundli.doshas.sadeSati.details}
                    </p>
                    <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-stone-700 dark:text-stone-200">
                      <strong>Prescribed Vedic Remedy:</strong> {currentKundli.doshas.sadeSati.remedy}
                    </div>

                    {/* Contextual 1-Tap Booking Button */}
                    <div className="mt-3 flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-stone-200 dark:border-stone-700">
                      <span className="text-[11px] text-stone-500 font-semibold">
                        Kashi Vishwanath Pradosh Kaal Telabhishek:
                      </span>
                      <button
                        onClick={() =>
                          openDoshaBooking({
                            doshaType: 'sade_sati',
                            title: 'Kashi Vishwanath Maha Rudra & Shani Shanti',
                            hindiTitle: 'काशी विश्वनाथ शनि साढ़े साती शांति एवं तेलाभिषेक संकल्प',
                            suggestedTemple: 'Shri Kashi Vishwanath Jyotirlinga',
                            location: 'Varanasi, UP',
                            deity: 'Lord Shiva & Shani Dev',
                            suggestedDakshina: 501,
                            priestName: 'Acharya Vidyadhar Shastri',
                            remedyDescription:
                              'Pradosh Kaal Bilva Patra and pure mustard oil arpan with devotee Name and Gotra to pacify Saturnian mental burdens, career stagnation, and acute anxiety.',
                            seekerName: currentKundli.name,
                            rashi: currentKundli.moonSign,
                            nakshatra: currentKundli.nakshatra,
                          })
                        }
                        className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition transform hover:scale-105"
                      >
                        <Flame className="w-3.5 h-3.5 text-amber-200" />
                        <span>Book Kashi Shani Shanti Sankalp (₹501)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Dasha */}
              {activeTab === 'dasha' && (
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3 text-xs">
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    Vimshottari Dasha Periods
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold">Mahadasha</span>
                      <div className="text-sm font-bold text-orange-600 mt-0.5">
                        {currentKundli.vimshottariDasha.mahadasha}
                      </div>
                      <span className="text-[11px] text-stone-500">Major Life Chapter</span>
                    </div>

                    <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold">Antardasha</span>
                      <div className="text-sm font-bold text-amber-600 mt-0.5">
                        {currentKundli.vimshottariDasha.antardasha}
                      </div>
                      <span className="text-[11px] text-stone-500">Active Sub-Period</span>
                    </div>

                    <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold">Pratyantar Dasha</span>
                      <div className="text-sm font-bold text-red-600 mt-0.5">
                        {currentKundli.vimshottariDasha.pratyantarDasha}
                      </div>
                      <span className="text-[11px] text-stone-500">Current Micro-Transit</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 text-stone-500">
              Fill in birth details and click "Calculate Janam Kundli" to explore your personalized Vedic horoscope.
            </div>
          )}
        </div>
      </div>

      {/* Social Share Card Preview Modal */}
      {showShareModal && currentKundli && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-amber-300 dark:border-stone-700 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-orange-600" />
                <span>Share Astrological Findings</span>
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Social Shareable Visual Card Preview */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 text-white shadow-xl space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="font-serif font-black tracking-wider text-sm">12Rashi.com</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase">
                  Verified Janam Kundli
                </span>
              </div>

              <div className="pt-2">
                <h4 className="text-xl font-bold">{currentKundli.name}</h4>
                <p className="text-xs text-amber-200">{currentKundli.dob} • {currentKundli.pob}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="bg-black/20 p-2 rounded-lg">
                  <div className="text-[10px] opacity-80">Lagna (Ascendant):</div>
                  <div className="font-bold">{currentKundli.ascendant}</div>
                </div>
                <div className="bg-black/20 p-2 rounded-lg">
                  <div className="text-[10px] opacity-80">Moon Sign (Rashi):</div>
                  <div className="font-bold">{currentKundli.moonSign}</div>
                </div>
                <div className="bg-black/20 p-2 rounded-lg">
                  <div className="text-[10px] opacity-80">Birth Star (Nakshatra):</div>
                  <div className="font-bold">{currentKundli.nakshatra}</div>
                </div>
                <div className="bg-black/20 p-2 rounded-lg">
                  <div className="text-[10px] opacity-80">Current Mahadasha:</div>
                  <div className="font-bold">{currentKundli.vimshottariDasha.mahadasha}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[10px] text-amber-200">
                <span>📞 Astrologer Hotline: +91 9831039814</span>
                <span>Kolkata, WB</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleWhatsAppShare}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Share to WhatsApp</span>
              </button>

              <button
                onClick={handleCopyShareLink}
                className="py-2.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
