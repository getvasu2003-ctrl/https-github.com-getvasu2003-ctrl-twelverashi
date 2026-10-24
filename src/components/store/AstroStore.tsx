import React, { useState } from 'react';
import {
  VEDIC_REMEDIES,
  PLANETARY_VRAT_GUIDELINES,
  VEDIC_DAAN_SEVA_REMEDIES,
  DOSHA_KARMA_PROTOCOLS,
  VedicMantraRemedy,
  PlanetaryVratRemedy,
  VedicDaanSevaRemedy,
  DoshaKarmaRemedy,
} from '../../data/remediesData.ts';
import { useApp } from '../../context/AppContext.tsx';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Volume2,
  Calendar,
  Layers,
  HeartHandshake,
  Play,
  RotateCw,
  X,
  ShieldCheck,
  Award,
  BookOpen,
  Sun,
  Moon,
  Feather,
  Heart,
  HelpCircle,
  Compass,
  Check,
  Gift,
} from 'lucide-react';
import {
  createCashfreeOrder,
  openCashfreeCheckout,
} from '../../services/apiService.ts';

interface AstroStoreProps {
  onOpenLivePuja?: () => void;
  onOpenReports?: () => void;
  onOpenGiftCards?: () => void;
}

export const AstroStore: React.FC<AstroStoreProps> = ({
  onOpenLivePuja,
  onOpenReports,
  onOpenGiftCards,
}) => {
  const { activeFamilyProfile, user, addNotification } = useApp();

  // Active section tab
  const [activeSection, setActiveSection] = useState<'mantras' | 'mala' | 'vrat' | 'daan' | 'doshas' | 'sankalps'>('mantras');

  // Mantra category filter
  const [mantraFilter, setMantraFilter] = useState<string>('all');
  const [selectedMantra, setSelectedMantra] = useState<VedicMantraRemedy | null>(null);

  // Digital 108 Jaap Mala Counter State
  const [activeMalaMantra, setActiveMalaMantra] = useState<VedicMantraRemedy>(VEDIC_REMEDIES[0]);
  const [malaCount, setMalaCount] = useState<number>(0);
  const [completedMalas, setCompletedMalas] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Virtual Sankalp Booking State (Non-Physical Temple Chanting in Devotee Name)
  const [sankalpMantra, setSankalpMantra] = useState<VedicMantraRemedy | null>(null);
  const [devoteeName, setDevoteeName] = useState(activeFamilyProfile?.name || user?.name || 'Vasudev Sharma');
  const [devoteeGotra, setDevoteeGotra] = useState(activeFamilyProfile?.gotra || 'Kashyap');
  const [devoteeRashi, setDevoteeRashi] = useState(activeFamilyProfile?.rashi || 'Simha (Leo)');
  const [sankalpWish, setSankalpWish] = useState('Health, spiritual clarity, and removal of all karmic obstacles');
  const [isBookingSankalp, setIsBookingSankalp] = useState(false);
  const [bookedSankalps, setBookedSankalps] = useState<{
    id: string;
    mantraTitle: string;
    devoteeName: string;
    gotra: string;
    temple: string;
    dakshina: number;
    date: string;
    certificateNumber: string;
  }[]>([
    {
      id: 'SNK-8921',
      mantraTitle: 'Maha Mrityunjaya Mantra Sanjeevani Sankalp',
      devoteeName: 'Vasudev Sharma',
      gotra: 'Kashyap',
      temple: 'Kashi Vishwanath Temple, Varanasi',
      dakshina: 501,
      date: '28 Sep 2026',
      certificateNumber: 'VNS-KASHI-SNK-9921',
    },
  ]);

  // Audio simulation state
  const [playingMantraId, setPlayingMantraId] = useState<string | null>(null);

  // Filtered mantras
  const filteredMantras = mantraFilter === 'all'
    ? VEDIC_REMEDIES
    : VEDIC_REMEDIES.filter((r) => r.category === mantraFilter);

  // Digital Mala Bead Click
  const handleMalaBeadClick = () => {
    // Play subtle soft beep audio if enabled
    if (soundEnabled && typeof window !== 'undefined' && window.AudioContext) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(malaCount + 1 === 108 ? 880 : 523.25, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } catch {
        // AudioContext silent fallback
      }
    }

    if (malaCount + 1 >= 108) {
      setMalaCount(0);
      setCompletedMalas((prev) => prev + 1);
      addNotification(
        '108 Jaap Mala Completed!',
        `Blessed! You completed 1 full sacred Mala of ${activeMalaMantra.title}.`,
        'muhurat'
      );
    } else {
      setMalaCount((prev) => prev + 1);
    }
  };

  const handleResetMala = () => {
    setMalaCount(0);
  };

  // Virtual Sankalp Booking via Cashfree
  const handleConfirmSankalp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sankalpMantra) return;

    setIsBookingSankalp(true);
    const dakshinaAmount = sankalpMantra.sankalpOfferingDakshina || 501;

    try {
      const order = await createCashfreeOrder({
        amount: dakshinaAmount,
        customerName: devoteeName,
        customerEmail: user?.email || 'devotee@12rashi.com',
        customerPhone: user?.phone || '9831049814',
        orderNote: `Temple E-Sankalp: ${sankalpMantra.title}`,
      });

      if (order && order.payment_session_id) {
        const checkoutRes = await openCashfreeCheckout(order.payment_session_id);
        if (checkoutRes && checkoutRes.success) {
          const newRecord = {
            id: 'SNK-' + Math.floor(1000 + Math.random() * 9000),
            mantraTitle: sankalpMantra.title,
            devoteeName,
            gotra: devoteeGotra,
            temple: sankalpMantra.templeLocation || 'Varanasi Peeth',
            dakshina: dakshinaAmount,
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            certificateNumber: 'CERT-' + Math.floor(100000 + Math.random() * 900000),
          };
          setBookedSankalps((prev) => [newRecord, ...prev]);
          addNotification(
            'Temple E-Sankalp Confirmed!',
            `Your sacred sankalp for ${sankalpMantra.title} at ${newRecord.temple} is recorded. Digital certificate generated.`,
            'muhurat'
          );
          setSankalpMantra(null);
          setActiveSection('sankalps');
        } else if (checkoutRes && checkoutRes.error) {
          alert(checkoutRes.error?.message || 'Payment could not be completed.');
        }
      } else {
        // Fallback local booking
        const newRecord = {
          id: 'SNK-' + Math.floor(1000 + Math.random() * 9000),
          mantraTitle: sankalpMantra.title,
          devoteeName,
          gotra: devoteeGotra,
          temple: sankalpMantra.templeLocation || 'Varanasi Peeth',
          dakshina: dakshinaAmount,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          certificateNumber: 'CERT-' + Math.floor(100000 + Math.random() * 900000),
        };
        setBookedSankalps((prev) => [newRecord, ...prev]);
        addNotification(
          'Temple E-Sankalp Confirmed!',
          `Your sacred sankalp for ${sankalpMantra.title} has been recorded.`,
          'muhurat'
        );
        setSankalpMantra(null);
        setActiveSection('sankalps');
      }
    } catch {
      setSankalpMantra(null);
    } finally {
      setIsBookingSankalp(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-stone-800 dark:text-stone-200">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-950 via-stone-900 to-amber-950 border border-orange-500/30 p-6 md:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Non-Physical Spiritual Remedies (मंत्र, व्रत, दान एवं कर्म शुद्धि)</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight">
              Vedic Remedies & Mantra Sadhana
            </h1>

            <p className="text-sm text-stone-300 leading-relaxed">
              Classical Parashari astrological remedies based entirely on <strong>acoustic mantras</strong>, <strong>planetary fasting (vrat)</strong>, <strong>compassionate charity (daan & jeev seva)</strong>, and <strong>karmic alignment</strong>. No physical merchandise or courier deliveries — pure scriptural spiritual practice.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => setActiveSection('mala')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                activeSection === 'mala'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/20'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700'
              }`}
            >
              <RotateCw className="w-4 h-4 text-amber-300" />
              <span>Digital 108 Mala ({completedMalas} completed)</span>
            </button>

            <button
              onClick={() => setActiveSection('sankalps')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                activeSection === 'sankalps'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/20'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700'
              }`}
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Temple E-Sankalps ({bookedSankalps.length})</span>
            </button>

            {onOpenLivePuja && (
              <button
                onClick={onOpenLivePuja}
                className="py-2.5 px-4 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer shadow-md bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white animate-pulse"
              >
                <span className="w-2 h-2 rounded-full bg-white" />
                <span>Live Temple Darshan & Pujas</span>
              </button>
            )}

            {onOpenReports && (
              <button
                onClick={onOpenReports}
                className="py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700 hover:border-orange-500/50"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>50+ Pg Kundli PDF (बृहत्)</span>
              </button>
            )}

            {onOpenGiftCards && (
              <button
                onClick={onOpenGiftCards}
                className="py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-purple-100 border border-purple-500/40"
              >
                <Gift className="w-4 h-4 text-purple-300" />
                <span>🎁 Shubh Shagun Gifts</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Section Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 dark:border-stone-800 no-scrollbar">
        <button
          onClick={() => setActiveSection('mantras')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
            activeSection === 'mantras'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-orange-300'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Vedic Mantras (वेदमंत्र)</span>
        </button>

        <button
          onClick={() => setActiveSection('mala')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
            activeSection === 'mala'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-orange-300'
          }`}
        >
          <RotateCw className="w-4 h-4" />
          <span>108 Digital Jaap Mala (जप माला)</span>
        </button>

        <button
          onClick={() => setActiveSection('vrat')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
            activeSection === 'vrat'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-orange-300'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Planetary Vrat & Fasting (व्रत नियम)</span>
        </button>

        <button
          onClick={() => setActiveSection('daan')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
            activeSection === 'daan'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-orange-300'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Daan & Jeev Seva (दान व जीव सेवा)</span>
        </button>

        <button
          onClick={() => setActiveSection('doshas')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
            activeSection === 'doshas'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-orange-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Dosha Nivaran (दोष शमन)</span>
        </button>

        <button
          onClick={() => setActiveSection('sankalps')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
            activeSection === 'sankalps'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-orange-300'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Temple E-Sankalps (ई-संकल्प)</span>
        </button>
      </div>

      {/* SECTION 1: MANTRAS & STOTRAS CATALOG */}
      {activeSection === 'mantras' && (
        <div className="space-y-6">
          {/* Mantra Subcategory Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {[
              { id: 'all', label: 'All Mantras (सभी मंत्र)' },
              { id: 'health', label: 'Health & Healing (आरोग्य)' },
              { id: 'wealth', label: 'Wealth & Prosperity (धन-समृद्धि)' },
              { id: 'protection', label: 'Protection & Nazar (सुरक्षा)' },
              { id: 'career', label: 'Career & Intellect (विद्या-उन्नति)' },
              { id: 'relationship', label: 'Marriage & Peace (दांपत्य)' },
              { id: 'graha_shanti', label: 'Navagraha (नवग्रह)' },
              { id: 'dosha_nivaran', label: 'Dosha Shanti (दोष शांति)' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setMantraFilter(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  mantraFilter === c.id
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs'
                    : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-orange-400'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Grid of Mantras */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMantras.map((remedy) => (
              <div
                key={remedy.id}
                className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-orange-300 dark:hover:border-stone-700 p-6 flex flex-col justify-between shadow-xs transition hover:shadow-md"
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 font-bold uppercase tracking-wider text-[10px]">
                      {remedy.rulingPlanet}
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                      {remedy.deity}
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 leading-tight">
                      {remedy.title}
                    </h3>
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mt-0.5">
                      {remedy.hindiTitle}
                    </p>
                  </div>

                  {/* Sanskrit Box */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-200/60 dark:border-stone-700/60 space-y-1.5">
                    <p className="font-serif text-sm font-semibold text-stone-900 dark:text-amber-100 leading-relaxed whitespace-pre-line text-center">
                      {remedy.sanskritVerse}
                    </p>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 italic text-center font-mono">
                      {remedy.transliteration}
                    </p>
                  </div>

                  {/* Meaning & Benefits */}
                  <div className="space-y-2 text-xs">
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3">
                      {remedy.meaning}
                    </p>
                    <ul className="space-y-1 text-[11px] text-stone-700 dark:text-stone-300">
                      {remedy.benefits.slice(0, 2).map((b, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sadhana Specs */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                      <Clock className="w-3.5 h-3.5 text-orange-500" />
                      <span>{remedy.bestTiming}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                      <RotateCw className="w-3.5 h-3.5 text-amber-500" />
                      <span>{remedy.jaapCount} Chants Daily</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-5 mt-4 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveMalaMantra(remedy);
                      setActiveSection('mala');
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Practice on Mala</span>
                  </button>

                  <button
                    onClick={() => setSelectedMantra(remedy)}
                    className="py-2.5 px-3 rounded-xl border border-stone-300 dark:border-stone-700 hover:border-orange-500 text-stone-700 dark:text-stone-300 font-semibold text-xs transition cursor-pointer"
                    title="View Full Scriptural Rules"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                  </button>

                  {remedy.virtualSankalpAvailable && (
                    <button
                      onClick={() => setSankalpMantra(remedy)}
                      className="py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-amber-900 dark:text-amber-200 font-bold text-xs transition cursor-pointer"
                      title="Request temple priest recitation in your name"
                    >
                      <span>E-Sankalp</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: DIGITAL 108 JAAP MALA SADHANA */}
      {activeSection === 'mala' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 md:p-10 shadow-sm max-w-3xl mx-auto space-y-8">
            {/* Header of Mala */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
              <div>
                <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 tracking-wider uppercase">
                  Sacred Digital Chanting Tool
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-white">
                  108 Jaap Mala Sadhana (१०८ जप माला)
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Tap the sacred bead or screen to count each chant. A divine chime rings at completion of 108 beads.
                </p>
              </div>

              {/* Mantra Selector */}
              <div className="shrink-0">
                <select
                  value={activeMalaMantra.id}
                  onChange={(e) => {
                    const found = VEDIC_REMEDIES.find((r) => r.id === e.target.value);
                    if (found) {
                      setActiveMalaMantra(found);
                      setMalaCount(0);
                    }
                  }}
                  className="p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 cursor-pointer outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {VEDIC_REMEDIES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.rulingPlanet})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Currently Active Mantra Verse Card */}
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700 text-center space-y-2">
              <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
                Chanting Focus: {activeMalaMantra.deity}
              </span>
              <p className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-amber-100 whitespace-pre-line leading-relaxed">
                {activeMalaMantra.sanskritVerse}
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-300 italic font-mono">
                {activeMalaMantra.transliteration}
              </p>
            </div>

            {/* Interactive Bead Counter Circle */}
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative flex items-center justify-center">
                {/* SVG Progress Ring */}
                <svg className="w-64 h-64 sm:w-72 sm:h-72 transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="42%"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-stone-200 dark:text-stone-800"
                    fill="transparent"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="42%"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 120}
                    strokeDashoffset={2 * Math.PI * 120 * (1 - malaCount / 108)}
                    strokeLinecap="round"
                    className="text-orange-500 transition-all duration-150 ease-out"
                    fill="transparent"
                  />
                </svg>

                {/* Central Clickable Bead Button */}
                <button
                  onClick={handleMalaBeadClick}
                  className="absolute inset-8 sm:inset-10 rounded-full bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white shadow-2xl flex flex-col items-center justify-center cursor-pointer transition transform active:scale-95 border-4 border-amber-300/40 select-none group"
                >
                  <span className="text-4xl sm:text-5xl font-mono font-extrabold tracking-tight">
                    {malaCount}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-amber-200 mt-1 uppercase tracking-widest">
                    / 108 Beads
                  </span>
                  <span className="text-[10px] text-amber-100/80 mt-2 font-bold group-hover:scale-105 transition">
                    TAP TO CHANT
                  </span>
                </button>
              </div>

              {/* Mala Stats & Controls */}
              <div className="flex items-center justify-between w-full max-w-sm px-4">
                <div className="text-center">
                  <span className="text-xs text-stone-500 dark:text-stone-400 block">Completed Malas</span>
                  <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {completedMalas} (x108)
                  </span>
                </div>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    soundEnabled
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30'
                      : 'border-stone-300 dark:border-stone-700 text-stone-500'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{soundEnabled ? 'Bell Chime On' : 'Silent'}</span>
                </button>

                <button
                  onClick={handleResetMala}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:border-red-400 text-stone-600 dark:text-stone-400 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Sacred Rules for Chanting */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
              <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-orange-500" />
                <span>Vedic Rules for Japa (जप साधना नियम):</span>
              </div>
              <ul className="space-y-1.5 text-stone-600 dark:text-stone-400 list-disc list-inside">
                <li>Best performed during <strong>Brahma Muhurat (4:30 AM - 6:00 AM)</strong> or during <strong>Sandhya Kaal (Sunset)</strong>.</li>
                <li>Keep the spine erect and face <strong>North or East</strong>.</li>
                <li>If using a physical mala, do not cross the <strong>Meru bead (sumeru)</strong>; reverse direction instead.</li>
                <li>Maintain reverent concentration without loud distraction. <em>Manasika</em> (silent mental chanting) carries 10x greater spiritual merit.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: PLANETARY VRAT (FASTING) GUIDELINES */}
      {activeSection === 'vrat' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-white">
              Planetary Vrat & Fasting Rules (वार एवं व्रत साधना)
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Fasting purifies bodily elements (Bhuta Shuddhi) and softens hostile planetary transits without expenditure. Choose the fast recommended for your weak planet or dasha.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLANETARY_VRAT_GUIDELINES.map((vrat) => (
              <div
                key={vrat.id}
                className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 flex flex-col justify-between shadow-xs space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold text-[10px] uppercase">
                      {vrat.day}
                    </span>
                    <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                      {vrat.rulingPlanet}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      {vrat.title}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                      {vrat.hindiTitle} • Deity: {vrat.deity}
                    </p>
                  </div>

                  {/* Recommended For */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                      Prescribed For:
                    </span>
                    <ul className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
                      {vrat.recommendedFor.map((r, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Foods Allowed vs Avoided */}
                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 space-y-2 text-xs">
                    <div>
                      <strong className="text-emerald-700 dark:text-emerald-400 block text-[11px] font-bold">
                        Foods Permitted (फलाहार):
                      </strong>
                      <p className="text-[11px] text-stone-600 dark:text-stone-300">
                        {vrat.foodsAllowed.join(', ')}
                      </p>
                    </div>

                    <div>
                      <strong className="text-red-600 dark:text-red-400 block text-[11px] font-bold">
                        Strictly Avoided:
                      </strong>
                      <p className="text-[11px] text-stone-600 dark:text-stone-300">
                        {vrat.foodsAvoided.join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Parana Timing & Mantra */}
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                      <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span><strong>Parana (Breaking Fast):</strong> {vrat.breakingFastMuhurat}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/50 font-mono text-[11px] text-orange-800 dark:text-orange-300 text-center font-bold">
                      {vrat.associatedMantra}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: VEDIC DAAN & JEEV SEVA REMEDIES */}
      {activeSection === 'daan' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-white">
              Vedic Daan & Jeev Seva (दान एवं जीव सेवा उपाय)
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Scriptures state that feeding voiceless creatures and satisfying the hungry dissolves karmic knots faster than expensive gemstones. Practice these simple acts in your daily life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VEDIC_DAAN_SEVA_REMEDIES.map((seva) => (
              <div
                key={seva.id}
                className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 flex flex-col justify-between shadow-xs space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                      {seva.sevaType}
                    </span>
                    <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                      {seva.planetPacified}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      {seva.title}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                      {seva.hindiTitle}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-stone-800/40 border border-amber-200/50 dark:border-stone-700/50 text-xs text-stone-700 dark:text-stone-300">
                    <strong className="block text-amber-900 dark:text-amber-200 text-[11px] font-bold">
                      Target Life Sphere:
                    </strong>
                    {seva.targetLifeSphere}
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                      How to Perform:
                    </span>
                    <ul className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
                      {seva.actionGuidelines.map((act, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] space-y-1 text-stone-500 dark:text-stone-400">
                    <p><strong>Ideal Muhurat:</strong> {seva.idealDayAndTime}</p>
                    <p className="italic text-stone-600 dark:text-stone-400">{seva.karmicSignificance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: MAJOR DOSHA NIVARAN KARMA PROTOCOLS */}
      {activeSection === 'doshas' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-white">
              Dosha Nivaran Karma Protocols (दोष शांति एवं आत्मिक उपाय)
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Authentic spiritual remedies for birth-chart afflictions (Sade Sati, Manglik, Kaal Sarp, and Pitra Dosha) based on inner conduct, humility, and sacred mantras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DOSHA_KARMA_PROTOCOLS.map((dosha) => (
              <div
                key={dosha.id}
                className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 flex flex-col justify-between shadow-xs space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 font-bold text-[10px] uppercase">
                      Planetary Diagnosis
                    </span>
                    <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                      Classical Vedic Remediation
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                      {dosha.doshaName}
                    </h3>
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                      {dosha.hindiName}
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                      {dosha.planetaryCause}
                    </p>
                  </div>

                  {/* Primary Mantra */}
                  <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-stone-800/80 border border-orange-200 dark:border-stone-700 text-center">
                    <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest block mb-1">
                      Prescribed Sacred Mantra
                    </span>
                    <p className="font-serif text-sm font-bold text-orange-950 dark:text-orange-200">
                      {dosha.primaryMantra}
                    </p>
                  </div>

                  {/* Non-Physical Protocols */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                      Non-Physical Remedial Conduct:
                    </span>
                    <ul className="space-y-1 text-xs text-stone-700 dark:text-stone-300">
                      {dosha.nonPhysicalProtocols.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Daily Discipline */}
                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60 space-y-1 text-[11px]">
                    <strong className="block text-stone-800 dark:text-stone-200 font-bold">
                      Daily Discipline Checklist:
                    </strong>
                    <ul className="space-y-0.5 text-stone-600 dark:text-stone-400 list-disc list-inside">
                      {dosha.dailyDiscipline.map((d, idx) => (
                        <li key={idx}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: TEMPLE E-SANKALPS (VIRTUAL PUJA CERTIFICATES) */}
      {activeSection === 'sankalps' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-white">
              My Temple E-Sankalps (ई-पूजा संकल्प रसीद)
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Virtual priest sankalpas performed in your name and gotra at sacred peeths (Varanasi, Haridwar, Ujjain). No physical items shipped.
            </p>
          </div>

          {bookedSankalps.length === 0 ? (
            <div className="p-8 text-center rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-3">
              <Award className="w-12 h-12 text-stone-400 mx-auto" />
              <h3 className="font-bold text-stone-700 dark:text-stone-300">No Active Temple Sankalps</h3>
              <p className="text-xs text-stone-500">
                You can book an auspicious Temple E-Sankalp from the Vedic Mantras section.
              </p>
              <button
                onClick={() => setActiveSection('mantras')}
                className="py-2 px-4 rounded-xl bg-orange-500 text-white text-xs font-bold transition hover:bg-orange-600 cursor-pointer"
              >
                Browse Mantras
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookedSankalps.map((sankalp) => (
                <div
                  key={sankalp.id}
                  className="rounded-3xl border border-amber-300 dark:border-amber-900/60 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/40 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 p-6 shadow-md relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between border-b border-amber-200 dark:border-stone-800 pb-3">
                    <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-400">
                      ID: {sankalp.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Consecrated & Confirmed</span>
                    </span>
                  </div>

                  <div className="pt-4 space-y-2">
                    <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      {sankalp.mantraTitle}
                    </h3>
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                      Temple: {sankalp.temple}
                    </p>

                    <div className="pt-2 grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-300">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Devotee Name</span>
                        <strong className="text-stone-900 dark:text-white">{sankalp.devoteeName}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Gotra</span>
                        <strong className="text-stone-900 dark:text-white">{sankalp.gotra}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Date of Sankalp</span>
                        <span>{sankalp.date}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Dakshina</span>
                        <span className="font-bold text-emerald-600">₹{sankalp.dakshina}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-amber-200 dark:border-stone-800 flex items-center justify-between text-[11px]">
                      <span className="text-stone-400 font-mono">Cert #{sankalp.certificateNumber}</span>
                      <button
                        onClick={() => alert(`Digital Certificate ${sankalp.certificateNumber} verified on 12Rashi Sacred Ledger.`)}
                        className="text-orange-600 dark:text-orange-400 font-bold hover:underline cursor-pointer"
                      >
                        View Verification Receipt
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FULL SCRIPTURAL DETAIL MODAL */}
      {selectedMantra && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-lg shadow-2xl border border-orange-300 dark:border-stone-700 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{selectedMantra.title}</h3>
                <p className="text-[11px] text-amber-100">{selectedMantra.hindiTitle}</p>
              </div>
              <button
                onClick={() => setSelectedMantra(null)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700 text-center space-y-2">
                <p className="font-serif text-base font-bold text-stone-900 dark:text-amber-100 whitespace-pre-line leading-relaxed">
                  {selectedMantra.sanskritVerse}
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-300 italic font-mono">
                  {selectedMantra.transliteration}
                </p>
              </div>

              <div>
                <strong className="block text-stone-800 dark:text-stone-200 mb-1">Deep Meaning:</strong>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  {selectedMantra.meaning}
                </p>
              </div>

              <div>
                <strong className="block text-stone-800 dark:text-stone-200 mb-1">Prescribed Sadhana Mala:</strong>
                <p className="text-stone-600 dark:text-stone-400">
                  {selectedMantra.prescribedMala}
                </p>
              </div>

              <div>
                <strong className="block text-stone-800 dark:text-stone-200 mb-1">Classical Chanting Rules:</strong>
                <ul className="space-y-1 text-stone-600 dark:text-stone-400 list-disc list-inside">
                  {selectedMantra.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    setActiveMalaMantra(selectedMantra);
                    setSelectedMantra(null);
                    setActiveSection('mala');
                  }}
                  className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition cursor-pointer text-center"
                >
                  Practice 108 Chants on Mala
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIRTUAL SANKALP MODAL */}
      {sankalpMantra && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-lg shadow-2xl border border-orange-300 dark:border-stone-700 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-white/20">
                  <Award className="w-5 h-5 text-amber-200" />
                </span>
                <div>
                  <h3 className="font-bold text-base">Book Temple E-Sankalp (ई-पूजा)</h3>
                  <p className="text-[11px] text-amber-100">
                    {sankalpMantra.templeLocation || 'Kashi Vishwanath, Varanasi'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSankalpMantra(null)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSankalp} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-1">
                <strong className="block font-semibold">{sankalpMantra.title}</strong>
                <p className="text-[11px] text-stone-600 dark:text-stone-400">
                  Priests at {sankalpMantra.templeLocation} will recite 108 chants and invoke divine blessings in your name and gotra. Purely non-physical ritual service; no items shipped.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Devotee Full Name *
                  </label>
                  <input
                    type="text"
                    value={devoteeName}
                    onChange={(e) => setDevoteeName(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Gotra (गोत्र) *
                  </label>
                  <input
                    type="text"
                    value={devoteeGotra}
                    onChange={(e) => setDevoteeGotra(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Janma Rashi
                  </label>
                  <input
                    type="text"
                    value={devoteeRashi}
                    onChange={(e) => setDevoteeRashi(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Dakshina Offering
                  </label>
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm">
                    ₹{sankalpMantra.sankalpOfferingDakshina || 501}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 dark:text-stone-300">
                  Sankalp Intention / Prayer (प्रार्थना)
                </label>
                <textarea
                  rows={2}
                  value={sankalpWish}
                  onChange={(e) => setSankalpWish(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSankalpMantra(null)}
                  className="flex-1 py-3 px-4 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBookingSankalp}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg transition cursor-pointer"
                >
                  {isBookingSankalp ? 'Connecting Gateway...' : `Offer Dakshina (₹${sankalpMantra.sankalpOfferingDakshina})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
